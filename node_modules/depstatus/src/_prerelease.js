let semver = require('semver')

module.exports = function prereleaseVersion (params) {
  let { dep, validRange, versionSpecified, specifiedPrerelease, versionInstalled, result } = params
  let installedPrerelease = semver.prerelease(versionInstalled)
  // Out of bounds: establish whether we're working with the same version and prerelease ID
  let oob = semver.outside(versionInstalled, versionSpecified, '>') &&
            semver.outside(versionInstalled, versionSpecified, '>')

  // Specified a prerelease, but a normal version is installed
  if (specifiedPrerelease && !installedPrerelease) {
    result.warn.push({
      [dep]: {
        versionSpecified,
        versionInstalled,
        warning: 'Specified version is prerelease; installed version is not'
      }
    })
  }
  // Prerelease version doesn't match
  else if (specifiedPrerelease[0] !== installedPrerelease[0] || oob) {
    result.warn.push({
      [dep]: {
        versionSpecified,
        versionInstalled,
        warning: 'Specified prerelease differs from installed prerelease'
      }
    })
  }
  // Dep is outdated
  else if (semver.ltr(versionInstalled, validRange, { includePrerelease: true })) {
    result.outdated.push({
      [dep]: {
        versionSpecified,
        versionInstalled
      }
    })
  }
  else {
    result.ok.push({
      [dep]: {
        versionSpecified,
        versionInstalled
      }
    })
  }
}
