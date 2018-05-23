const i18nSupportedLocales = require('terra-i18n/lib/i18nSupportedLocales');
const navConfig = require('./navigation.config');
const startCase = require('lodash.startcase');
const fs = require('fs');
const path = require('path');

const npmPackage = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json')));

const siteConfig = {
  /* The navigation configuration. */
  navConfig,

  /* The path to the pages configuration. If this is enabled, the `generatePages` configuration will not be used. */
  pagesConfig: undefined,

  /** These options are used to find the pages to serve via terra-dev-site. If 'pagesConfig' is provided, this
   * configuration is not used.
   *   The search pattern key options:
   *      root: where the search pattern starts.
   *      entryPoint: added to the search pattern and is where the of the directory structure
   *           for menu navigation will begin.
   *      dist: (option) the directory containing transpiled code to use if hot reloading is enabled and is in prod.
   *      source: (option) the directory containing source code to use if hot reloading is enabled and not in prod mode.
   */
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

  /** Whether or not hot reloading section should be enabled. This applies to the search searchPatterns
   * and mono-repo package aliasing. This is enabled by default for dev builds.
   */
  hotReloading: true,

  /* The mono-repo package path(s). This is used to automatically alias package directories in webpack. We can support multiple. */
  monoRepo: {
    packages: [
      path.resolve(process.cwd(), 'packages'),
    ],
  },

  /** This options will automatically alias package directories in webpack based on hot reloading and prod settings.
   *  Note: dist will be aliased as source.
   *     dist: the directories containing transpiled code to use if hot reloading is enabled and is in prod.
   *     source: the directories containing source code to use if hot reloading is enabled and not in prod mode.
   */
  webpackAliasOptions: {
    dist: 'lib',
    source: 'src',
  },

  /** The root-level npm package.json file. Change this if you have a non-standard package.json path.
   * Defaults to the <root_dir>/package.json
   */
  npmPackage,

  /* The list of side effect theme files. */
  themeImports: [],

  /* Path to the image to display as page placeholder when a component does not render. */
  placeholderSrc: path.join(__dirname, '..', '..', 'terra.png'),

  /* The README content to display on the home page. Set to undefined to opt out. */
  readMeContent: path.resolve(process.cwd(), 'README.md'),

  appConfig: {
    /* Path to the logo the site header should display. */
    logoSrc: path.join(__dirname, '..', '..', 'terra.png'),

    /* The title the site header should display. */
    title: startCase(npmPackage.name), // maps to appTitle

    /* Path to the favicon for the site. */
    favicon: path.join(__dirname, '..', '..', 'terra-favicon', '32px', 'favicon.ico'),

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
     * between locales. Defaulted to the supported locals list in terra-18n.
     */
    locales: i18nSupportedLocales,

    /* The default locale of the site. 'en' is the default theme. */
    defaultLocale: 'en',

    /** Indicates if the site supports bidirectionality. If enabled, the directionality
     * utility will display in the toolbar.
     */
    bidirectional: true,

    /* The default direction of the site. 'ltr' is the default direction. */
    defaultDirection: 'ltr',

    /** The configuration for adding the external extensions section of the site.
     *   Add like:
     *     extensions: {
     *       // The url to link to github. If this is supplied a github extention will be display to link to the supplied url
     *       gitHubUrl: 'https://github.com/cerner',
     *     },
     */
    ...(npmPackage.repository.url) && {
      extensions: {
        gitHubUrl: npmPackage.repository.url.replace('git+', ''),
      },
    },
  },
};

module.exports = siteConfig;
