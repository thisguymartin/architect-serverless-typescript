let semver = require('semver')

module.exports = function normalVersion (params) {
  let { dep, validRange, versionSpecified, versionInstalled, result } = params
  let isOk = semver.satisfies(versionInstalled, validRange)
  let isOutdated = semver.ltr(versionInstalled, validRange)
  if (isOk) {
    result.ok.push({
      [dep]: {
        versionSpecified,
        versionInstalled
      }
    })
  }
  else if (isOutdated) {
    result.outdated.push({
      [dep]: {
        versionSpecified,
        versionInstalled
      }
    })
  }
  else {
    result.warn.push({
      [dep]: {
        versionSpecified,
        versionInstalled,
        warning: 'Installed version is too far ahead of specified version'
      }
    })
  }
}
