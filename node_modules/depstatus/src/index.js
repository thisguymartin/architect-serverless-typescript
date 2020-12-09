let semver = require('semver')
let fs = require('fs')
let exists = fs.existsSync
let path = require('path')
let join = path.join

let prerelease = require('./_prerelease')
let normal = require('./_normal')
let special = require('./_special')

let read = file => JSON.parse(fs.readFileSync(file).toString())

module.exports = function depStatus (dir, opts = {}) {
  if (!dir || typeof dir !== 'string')
    throw ReferenceError('File path required to check dependencies')

  function checkSpecials (str) {
    let tar = [ '.tar', '.tar.gz', '.tgz' ].some(ext => str.endsWith(ext))
    let git = str.startsWith('git+')
    return tar || git
  }

  let { time } = opts
  if (time)
    console.time(`Dependency status for ${dir}`)

  let packageFile = join(dir, 'package.json')
  let hasPackage = exists(packageFile)
  let packageLockFile = join(dir, 'package-lock.json')
  let hasPackageLock = exists(packageLockFile)

  if (!hasPackage)
    throw ReferenceError('File path does not contain a package.json file')

  let result = {
    ok: [],
    missing: [],
    outdated: [],
    warn: []
  }

  let package = read(packageFile)
  let deps = package.dependencies
  if (!deps)
    return result // Exit early

  let lockDeps
  if (hasPackageLock) {
    let packageLock = read(packageLockFile)
    lockDeps = packageLock.dependencies
  }

  let tree = Object.getOwnPropertyNames(deps)
  tree.forEach(dep => {
    let folder = dep
    let versionSpecified = deps[dep]
    // Prefer lockfile version if available
    if (lockDeps && lockDeps[dep] && lockDeps[dep].version)
      versionSpecified = lockDeps[dep].version

    // Handle deps pinned to tag names, or malformed versions, and no lockfile
    let isSpecialCase = checkSpecials(versionSpecified)

    let isValid = semver.valid(semver.coerce(versionSpecified)) || isSpecialCase

    let notValidAndNoLock = !isValid && !lockDeps
    let notValidAndMissingFromLock = !isValid && lockDeps && !lockDeps[dep]
    if (notValidAndNoLock || notValidAndMissingFromLock) {
      result.warn.push({
        [dep]: {
          versionSpecified,
          warning: 'Version specified is invalid and/or not found in package-lock.json'
        }
      })
    }
    else {
      // Handle namespaced packages
      if (dep.startsWith('@')) folder = dep.split('/').join(path.sep)
      // This is it!
      let depPackageFile = join(dir, 'node_modules', folder, 'package.json')
      if (!exists(depPackageFile)) {
        result.missing.push({
          [dep]: {
            versionSpecified,
            versionInstalled: null
          }
        })
      }
      else {
        let versionInstalled
        try {
          /**
           * Regular versions vs prerelease versions
           *   Logic paths split below, as prerelease versions are effectively a different dimension of semver. For example:
           *   - `1.0.0-RC.1` should be treated differently than `1.0.1-RC.1` (or `1.0.0`)
           *   Note: when using NPM to install a prerelease, it will specify a range (e.g. `^1.0.0-RC.1`)
           */
          versionInstalled = read(depPackageFile).version
          let validRange = semver.validRange(versionSpecified)

          let specifiedPrerelease
          if (!isSpecialCase) {
            // Get the minVersion because semver.prerelease doesn't accept prerelease ranges (e.g. `^1.0.0-RC.1`)
            let minSpecified = semver.minVersion(versionSpecified)
            specifiedPrerelease = semver.prerelease(minSpecified)
          }

          let params = {
            dep,
            validRange,
            versionSpecified,
            specifiedPrerelease,
            versionInstalled,
            result
          }

          // Handle prereleases first
          if (specifiedPrerelease) {
            prerelease(params)
          }
          // Then the normal versions
          else if (validRange) {
            normal(params)
          }
          // Then the special cases
          else if (isSpecialCase) {
            special(params)
          }
          // ¯\_(ツ)_/¯
          else {
            result.warn.push({
              [dep]: {
                versionSpecified,
                versionInstalled,
                warning: 'Specified version is invalid'
              }
            })
          }
        }
        catch (err) {
          versionInstalled = versionInstalled || null
          result.warn.push({
            [dep]: {
              versionSpecified,
              versionInstalled,
              warning: `Error: ${err.message ? err.message : 'Unknown error'}`
            }
          })
        }
      }
    }
  })
  if (time)
    console.timeEnd(`Dependency status for ${dir}`)

  return result
}
