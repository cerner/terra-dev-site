Changelog
=========

Unreleased
----------
### Changes
* Updated the default the search paths for test examples to search for `.example.jsx` to allow for more flexible file structure for text exmaples.
* Remove the last layer of sub-navigation for non-test pages that should have nested navigation but only one page exists


0.1.0 - (Febuary 26, 2018)
----------
* Renamed to terra-dev-site

2.0.0-RC.6 - (Febuary 23, 2018)
----------
### Fixed
- Upgrade to react 16
- Make the generate-component-config script compatible for windows devices
- Added Jest Tests

2.0.0-RC.5 - (Febuary 15, 2018)
----------
### Fixed
- Fix raw route from failing when no navigation is passed in.

2.0.0-RC.4 - (Febuary 15, 2018)
----------
### Added
- Add support in generateComponentConfig for creating configuration from a terra repository that was installed as a package

### Changed
* Update to React 16
* Update webpack.config to only pass one globally defined DefinePlugin variable
* Expose terra-framework-application-header extensions prop. To use this prop, add an extensions key to the navigation object in the navigation.config

### Fixed
- Fix ES5 and ES6 module clashing in the site configurations
- Fix Home page styling
- Fix sub navigation creation to check if a a single site page contains additional sub navigation
- Allow for custom Home pages
- Update theming-plugin to only output themeable-variables.json in the root directory
- Generate routes and navigation for component configuration not containing sub-nav
```
// config that does not contain the 'pages' or 'tests' keys
{
  name: 'Component',
  path: '/component',
  component: Component,
}
```

### Removed
- Remove subtitle site config options to align with the coming Application Name Components
- In navigation.config, removed `isStatic` key option in favor of only using `hasSubNav` key

2.0.0-RC.3 - (Febuary 1, 2018)
----------
### Changed
- Set the default componentConfigPath to be the default generated-component-config output location.

### Fixed
- Updates the site components to use Css Modules
- Update webpack.config to allow for package-level testing

### Fixed
- Update the application menu to display the correct navigation links at small sizes

2.0.0-RC.2 - (January 29, 2018)
----------
### Changed
- Emily broke bi-di with the previous releease, this one fixes it.

2.0.0-RC.1 - (January 29, 2018)
----------
### Changed
- Create additional raw test routes to keep tests at modular level.
- In the generate-component-config, sort the found files to be in alphabetical order for navigation

### Fixed
- Set the `hideBidiUtility` default prop to be false as mapped to the site config

2.0.0-RC.0 - (January 26, 2018)
----------
### Major Version Bump
Terra-dev-site has been enhanced from a site that displays docs, examples and tests of component packages contained
within the terra-core repository to be a package that dynamically builds a react-hash-routed site based on site
configuration, navigation configuration and component configuration.

Provides the following script:
* generate-component-config: generates the component configuration needed to build the site.

Provides the following default configuration:
* site.config.js: must supply the componentConfigPath
* navigation.config.js
* webpack.config.js
* webpack.prod.config.js

# Changed
* Package dependencies
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
