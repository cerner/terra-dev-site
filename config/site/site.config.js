const i18nSupportedLocales = require('terra-i18n/lib/i18nSupportedLocales');
const navConfig = require('./navigation.config');
const startCase = require('lodash.startcase');
const fs = require('fs');
const path = require('path');

const npmPackage = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json')));

const siteConfig = {
  /* The navigation configuration.  */
  navConfig,

  /* The path to the pages configuration. If this is enabled, the `generatePages` configuration will not be used. */
  pagesConfig: undefined,

  /** These options are used to find the pages to serve via terra dev site. If 'pagesConfig' is provided, this
   * configuration is not used.
   *   The search pattern key options:
   *      root: there search pattern starts.
   *      entryPoint: add to the search pattern and is the beginning of the directory structure
   *           for menu navigation.
   *      dist: (option) directory containing transpiled code to use if hot reloading is enabled and is in prod
   *      source: (option) directory containing source code to use if hot reloading is enabled and not in prod mode
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

  /** Hot reloading section. On by default for dev builds.
   * This applies to the search patterns and mono-repo package aliasing.
   */
  hotReloading: true,

  /*
   * Specifiy the mono-repo path. This will automatically alias package directories in webpack.
   */
  monoRepo: {
    packages: path.resolve(process.cwd(), 'packages'),
  },

   /** This will automatically alias package directories in webpack. Based on hot relaoding and prod settings
    *  dist will be aliased as source.
    *     dist: the directories containing transpiled code to use if hot reloading is enabled and is in prod
    *     source: the directories containing source code to use if hot reloading is enabled and not in prod mode
    */
  webpackAliasOptions: {
    dist: 'lib',
    source: 'src',
  },

  /* The parsed root level npm package. May need to change this if you have a non-standard package.json path. */
  npmPackage,

  /* The list of side effect theme file */
  themeImports: [],

  /* Path to the image to display as page placeholder when a component does not render. */
  placeholderSrc: path.join(__dirname, '..', '..', 'terra.png'),

  /* The README content to display on the home page. */
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
     * between locales. English is the default language.
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

    /** Configuration relating to the extensions section of the site.
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
