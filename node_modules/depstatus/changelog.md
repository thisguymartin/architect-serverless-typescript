# Depstatus changelog

---

## [1.1.1] 2020-09-14

### Changed

- Removed testing for Node.js 8.x (EOL December, 2019); technically everything should still work in 8.x, so this is not a breaking change
- Removed `mkdirp` dep in tests

---

## [1.1.0] 2020-04-18

### Added

- Added support for packages installed via archive (`.tar`, `.tar.gz`, `.tgz`) and git (`npm i https://someurl.com/repo.git`


### Changed

- Updated `semver`

---


## [1.0.0] 20019-09-19

Initial release!

---

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
