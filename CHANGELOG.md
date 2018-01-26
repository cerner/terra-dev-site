Changelog
=========

Unreleased
----------
### Changed
- Create additional raw test routes to keep tests at modular level.
- In the generate-component-config, sort the found files to be in alphabetical order for navigation

### Fixed
- Set the `hideBidiUtility` default prop to be false as mapped to the site config

2.0.0-RC.0 - (January 26, 2018)
----------
### Major Version Bump
Terra-site has been enhanced from a site that displays docs, examples and tests of component packages contained
within the terra-core repository to be a package that dynamically builds a react-hash-routed site based on site
configuration, navigation configuration and component configuration.

Provides the following script:
* generate-compoent-config: generates the component configuration needed to build the site.

Provides the following default configuration:
* site.config.js: must supply the componentConfigPath
* navigation.config.js
* webpack.config.js
* webpack.prod.config.js

# Changed
* Package dependencies
* themeing-plugin.js is still available but no longer provided in the webpack Configuration
* themeing-plugin.js was updated to be compatible on windows devices

# Removed
* scr/examples
* scr/assests
* cerner-mock-theme.scss
* themeable-variables.json
* postcss.config.js


1.22.0 - (January 18, 2018)
------------------
### Changed
* Add context to selectable list example

### Added
* Add terra-form-radio components

1.21.0 - (January 5, 2018)
------------------
### Added
* Added badge mock theme

### Changed
* Update site and button examples to use V2
* Fixed broken image in arrange example

1.20.0 - (December 5, 2017)
------------------
### Added
* Add terra-time-input mock theme styles and 12 hour input examples.
* Added styles for terra-modal content displaying div.

### Changed
* Minor version bump
* Place site header background on a parent div, instead of collapsible.


1.19.0 - (November 28, 2017)
------------------
### Changed
* Minor version bump

1.18.0 - (November 16, 2017)
------------------
### Added
* Add terra-form-checkbox components
* Add terra-form-textarea components
* Add terra-form-field components
* Add terra-mock-theme styles

1.17.0 - (November 7, 2017)
------------------
### Changed
* Minor version bump

1.16.0 - (October 31, 2017)
------------------
### Changed
* Minor version bump

1.15.0 - (October 24, 2017)
------------------
### Changed
* Lock webpack-dev-server at last version supporting IE10 (1.7.1)
* Uplift site header to use collapsible menu view
* Removing verbose build scripts and related files

1.14.0 - (October 12, 2017)
------------------
### Updated
* Updated select component example with disabled options support

### Updated
* Updated content-container site examples to use appropriate header and content.
* Updated webpack config to align with webpack 3 documentation

1.13.0 - (October 6, 2017)
------------------
### Changed
* Minor version bump
* Updated terra-toggle examples

1.12.0 - (September 26, 2017)
------------------
### Fixed
* Updating theming-plugin match regex to allow for multiple fallback values.

### Added
* Selectable Table Test Routes

### Changed
* Break out list examples into their own pages.
* Break out static and themeable icon examples into their own pages

1.11.0 - (September 19, 2017)
------------------
### Changed
* Updated ArrangeAlignment to generate Ids with `_.uniqueId()`.
* Fixed scroll reset to account for theme provider

### Fixed
* Fixed title misspelling.
* Bidi display of label-value pairs of input examples

1.10.0 - (September 12, 2017)
------------------
### Changed
* Minor version bump

1.9.0 - (September 7, 2017)
------------------
### Changed
* Minor version bump

1.8.0 - (September 5, 2017)
------------------
### Added
* Added ThemeProvider component examples

1.7.0 - (August 31, 2017)
------------------
### Added
* Added line-height styles to site-nav
* Fixed prop-types error for invalid data type in search field examples

### Changed
* Updated various examples to use `span` instead of `p` elements in sample content
* Added ThemeProvider component examples
* Added new relic script

1.6.0 - (August 15, 2017)
------------------
### Changed
* Update site to use slide panel
* Break out form component examples into their own packages

1.5.0 - (August 8, 2017)
------------------
### Changed
* Display input and submission values for DatePicker, Form, SearchField and TimeInput examples.

1.4.0 - (August 1, 2017)
------------------
### Changed
* Minor version bump

1.3.0 - (August 1, 2017)
------------------
### Added
* Added new example to display date picker and popup inside modal.
* Add test links for the Markdown component

### Changed
* Updated PropsTable rendering to include component title for packages that contain multiple components.

1.2.0 - (July 26, 2017)
------------------
### Changed
* Converted component to use CSS modules
* Updated Search Field example to demonstrate onInvalidSearch.
* Add Model Manager Test Link

1.1.0 - (July 18, 2017)
------------------
### Added
* Added new feature terra-overlay to site page

### Changed
* Moved DatePickers and TimeInput examples into their own files.

1.0.0 - (June 28, 2017)
------------------
Initial stable release
