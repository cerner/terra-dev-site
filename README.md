<!-- Logo -->
<p align="center">
  <img height="128" width="128" src="https://github.com/cerner/terra-dev-site/raw/master/terra.png">
</p>

<!-- Name -->
<h1 align="center">
  Terra Dev Site
</h1>

[![NPM version](https://img.shields.io/npm/v/terra-dev-site.svg)](https://www.npmjs.org/package/terra-dev-site)
[![Build Status](https://travis-ci.org/cerner/terra-dev-site.svg?branch=master)](https://travis-ci.org/cerner/terra-dev-site)

Dynamically builds a react-hash-routed site based on site configuration, navigation configuration and page configuration.

The provided webpack config includes a call to the generateAppConfig script. The generateAppConfig script builds out static config to the ./dev-site-config/build folder. generateAppConfig also discovers pages based on it's configuration. After the static config has been built webpack continues to run, pulling in the static config, and producing the webpack bundle.

Provides the following script:
* `tds:generate-app-config`: generates the static files the site requires.

Provides the following default configuration:
* `config/site/site.config.js`
* `config/site/navigation.config.js`
* `config/webpack/webpack.config.js`
* `config/wdio/wdio.conf.js`

- [Getting Started](#getting-started)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [LICENSE](#license)

## Getting Started

- Install with [npm](https://www.npmjs.com): `npm install terra-dev-site`

## Versioning

terra-dev-site is considered to be stable and will follow [SemVer](https://semver.org/) for versioning.
1. MAJOR versions represent breaking changes
2. MINOR versions represent added functionality in a backwards-compatible manner
3. PATCH versions represent backwards-compatible bug fixes

Consult the component CHANGELOGs, related issues, and PRs for more information.

## Contributing

Please read through our [contributing guidelines](CONTRIBUTING.md). Included are directions for issue reporting and pull requests.

## LICENSE

Copyright 2017 Cerner Innovation, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

&nbsp;&nbsp;&nbsp;&nbsp;http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
