module.exports = function specialVersion (params) {
  let { dep, versionSpecified, versionInstalled, result } = params
  let isOk = versionInstalled
  if (isOk) {
    result.ok.push({
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
        warning: 'Package file is invalid; per npm, it must contain: name, version'
      }
    })
  }
}
