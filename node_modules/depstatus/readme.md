# depStatus

## A simple, synchronous way to get a status check on installed Node.js dependencies

Perhaps you need to know whether your project's packages are correctly installed, or are out of date, or maybe even are ahead in time (from working in a branch, for example), or just have something funky going on. Try depStatus!

Unlike other dependency status checkers, depStatus:

- Runs synchronously and quite quickly
- Only has a single dependency: `semver`
- Has full support for prerelease package versions (e.g. `"a-package": "^2.0.0-RC.1"`)
- Also supports NPM tag pinning (e.g. `"a-package": "latest"`)
- Even supports packages installed via archive (`.tar`, `.tar.gz`, `.tgz`) and git (`npm i https://someurl.com/repo.git`
- Respects and uses `package-lock.json` if present (but does not depend on it)


### Installation

`npm i depstatus`


### Usage

depStatus accepts two parameters:
- `dir`: **String** file path containing a `package.json` file
- `options`: **Object** options; named parameter `time` will console log the amount of time it took to run each dependency check

**Example:**
```js
let depStatus = require('depstatus')
let dir = '/a/dir/to/check' // must contain package.json
let result = depStatus(dir)
```

depStatus returns the following object:

```js
{
  ok: [
    {
      'an-ok-dependency': {
        versionSpecified: '1.0.0',
        versionInstalled: '1.0.0'
      }
    }
  ],
  missing: [
    {
      'a-dep-not-yet-installed': {
        versionSpecified: '1.0.0',
        versionInstalled: null
      }
    }
  ],
  outdated: [
    {
      'an-outdated-dependency': {
        versionSpecified: '1.0.0',
        versionInstalled: '0.1.0'
      }
    }
  ],
  warn: [
    {
      'a-dependency-with-an-issue': {
        versionSpecified: '~1.0.0',
        versionInstalled: '1.1.0',
        warning: 'Installed version is too far ahead of specified version'
      }
    }
  ]
}
```

- **Ok:** Array of dependency names that are installed, and whose installed version satisfies the requirements of `package.json` (or `package-lock.json` if present)
- **Missing:** Array of dependency names that were not found on the filesystem
- **Outdated:** Array of dependency names that are outdated, and thus do not satisfy the requirements of `package.json` (or `package-lock.json` if present)
- **Warn:** Array of dependency names that have an issue (e.g. non-conformance to semver; specify a tag, but cannot be found in `package-lock.json`, etc.)


### Caveats

- depStatus only checks the installed status of dependencies, and does not check devDependencies
