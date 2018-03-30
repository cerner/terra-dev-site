# SiteDocTemplate
Provides a standard and easily adjustable layout for all documentation pages.

## Getting Started

- Install with [npmjs](https://www.npmjs.com):
  - `npm install terra-dev-site`
  - `yarn add terra-dev-site`

## Usage
```
import { version } from '../package.json';
import readme from './README.md';

<SiteDocTemplate version={version} readme={readme} />
```
See also: the example below, demonstrating a more complete SiteDocTemplate configuration