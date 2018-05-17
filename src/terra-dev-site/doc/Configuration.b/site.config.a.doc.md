# Site Config

Site config is the main config for the terra-dev-site. Depending on your repo setup, site config may not be needed. If it is, it must be located in the dev-site-config folder. The site config below is for documentation purposes and may require modifications before use.

[Default site config](https://github.com/cerner/terra-dev-site/blob/master/config/site/site.config.js)

```javascript
const navConfig = require('./navigation.config');
const pagesConfig = require ('./pages.config');
const fs = require('fs');
const path = require('path');

const npmPackage = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json')));

const siteConfig = {
  /* The navigation configuration.  */
  navConfig,

  /* The path to the pages configuration. If this is enabled, page config will not be generated and generatePages will not be used. */
  pagesConfig,

  // These options are used to find the pages to serve via terra dev site.
  // If 'pagesConfig' is provided, no pages will be generated.
  // Output:
  // {root}/lib/{entryPoint}/**/*{pageType}.{jsx,js,md,}
  // {root}/packages/*/lib/{entryPoint}/**/*{pageType}.{jsx,js,md,}
  // source will be used if hot reloading is enabled and not running in prod mode.
  // source and dist are optional.
  // *NOTE* The entryPoints also act as the beginning of the directory strucure for menu navigation.
  // For example: /root/src/<entryPointDir>/folder/item would start navigation at 'folder'.
  generatePages: {
    searchPatterns: [
      {
        root: process.cwd(),
        source: 'src',
        dist: 'lib',
        entryPoint: 'terra-dev-site',
      },
    ],
  },

  /* Hot reloading section. On by default for dev builds. This will automatically alias the dist dir as the source dir if you use the bundled webpack config. */
  hotReloading: {
    enabled: true,
    source: 'src',
    dist: 'lib',
  },

  /* Additional alias to add to webpack, see webpacks doc for more info on aliases. */
  webpackAliases: {
    moment: '../node_modules/moment',
  },

  /* The mono repo package directory. If this is found aliases will be setup for the mono repo packages by default.
   * Defaults to the packages directory from the root dir.
   */
  monoRepoPackageDir: '../packages',

  /* The actual parced package.json file. May need to change this if you have a non-standard package.json path.
   * Defaults to the root dir package.json
   */
  npmPackage,

  /* Side effect theme imports */
  themeImports: [
    '../theme';
  ],

  /* Path to the image to display as page placeholder when a component does not render.
   * Defaulted to the terra logo from this repo.
   */
  placeholderSrc: '../logo.png',

  /* The README content to display on the home page. */
   * Defaulted to the readme in the root directory.
   * Set to undefined to opt out.
   */
  readMeContent: '../README.md',

  appConfig: {
    /* Path to the logo the site header should display.
     * Defaulted to the terra logo from this repo.
     */
    logoSrc: '../logo.png',

    /* The title the site header should display.
     * Defaulted to the package name from the root package.json
     */
    title: 'Title'

    /* Path to the favicon for the site. */
    favicon: '../favicon.ico',

    /** The themes to supply the ThemeProvider which allows the site to switch
      * between themes. Providing multiple enables the theme utility to display
      * in the header's toolbar.
      */
    themes: {
      'Default Theme': '',
    },

    /** The default theme of the site. Note, this value should be a key that was
     * supplied to the themes object. The open-sourced theme is the default theme.
     */
    defaultTheme: 'Default Theme',

    /** The locales to supply Base with, which allows the site to switch
      * between locales. English is the default language.
      * Defaulted to the suppported locals list in terra-18n
      */
    locales: ['ar', 'en', 'en-US', 'en-GB', 'es', 'es-US', 'es-ES', 'de', 'fi-FI', 'fr', 'fr-FR', 'nl', 'nl-BE', 'pt', 'pt-BR'],

    /* The default locale of the site. 'en' is the default theme. */
    defaultLocale: 'en',

    /** Indicates if the site supports bidirectionality. If enabled, the directionality
      * utility will display in the toolbar.
      */
    bidirectional: true,

    /* The default direction of the site. 'ltr' is the default direction. */
    defaultDirection: 'ltr',

    /* Configuration relating to the extensions section of the site. Not rendered if extensions are supplied by navigation config */
    extensions: {
      // The url to link to github. If this is supplied a github extention will be display to link to the supplied url
      // Defaulted to the repository url specified in the root package.json
      gitHubUrl: 'https://github.com/cerner',
    },
  },
};

module.exports = siteConfig;
```
