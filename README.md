<!-- Logo -->
<p align="center">
  <img height="128" width="128" src="https://github.com/cerner/terra-dev-site/raw/main/terra.png" alt="terra logo" />
</p>

<!-- Name -->
<h1 align="center">
  Terra Dev Site
</h1>

[![NPM version](https://badgen.net/npm/v/terra-dev-site)](https://www.npmjs.org/package/terra-dev-site)
[![Cerner OSS](https://badgen.net/badge/Cerner/OSS/blue)](http://engineering.cerner.com/2014/01/cerner-and-open-source/)
[![License](https://badgen.net/github/license/cerner/terra-dev-site)](https://github.com/cerner/terra-dev-site/blob/main/LICENSE)
[![Build Status](https://badgen.net/travis/cerner/terra-dev-site)](https://travis-ci.com/cerner/terra-dev-site)
[![Dependencies status](https://badgen.net/david/dep/cerner/terra-dev-site)](https://david-dm.org/cerner/terra-dev-site)
[![devDependencies status](https://badgen.net/david/dev/cerner/terra-dev-site)](https://david-dm.org/cerner/terra-dev-site?type=dev)

Dynamically builds a site based on site configuration, navigation configuration and page configuration.

The provided webpack plugin includes a call to the generateAppConfig script. The generateAppConfig script builds out static config to the ./dev-site-config/build folder. generateAppConfig also discovers pages based on it's configuration. After the static config has been built webpack continues to run, pulling in the static config, and producing the webpack bundle.

Provides the following default configuration:

* `config/site/site.config.js`
* `config/site/navigation.config.js`
* `config/webpack/webpack.config.js`

* [Getting Started](#getting-started)
* [Versioning](#versioning)
* [Contributing](#contributing)
* [LICENSE](#license)

## Getting Started

* Install with [npm](https://www.npmjs.com): `npm install --save-dev terra-dev-site`

## Peer Dependencies

This component requires the following peer dependencies be installed in your app for the component to properly function.

| Peer Dependency | Version |
|-|-|
| react | ^16.8.5 |
| react-dom | ^16.8.5 |
| terra-toolkit | ^5.2.0 |
| webpack | ^4.28.1 |

## Versioning

terra-dev-site is considered to be stable and will follow [SemVer](https://semver.org/) for versioning.

1. MAJOR versions represent breaking changes
2. MINOR versions represent added functionality in a backwards-compatible manner
3. PATCH versions represent backwards-compatible bug fixes

Consult the component CHANGELOGs, related issues, and PRs for more information.

## Contributing

Please read through our [contributing guidelines](https://github.com/cerner/terra-dev-site/blob/main/CONTRIBUTING.md). Included are directions for issue reporting and pull requests.

## LICENSE

Copyright 2018 - 2020 Cerner Innovation, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

<http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
