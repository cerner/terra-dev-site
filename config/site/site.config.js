const startCase = require('lodash.startcase');
const fs = require('fs');
const path = require('path');
const navConfig = require('./navigation.config');

const npmPackage = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));

const siteConfig = {
  /* The navigation configuration. */
  navConfig,

  /* The path to the pages configuration. If this is enabled, the `generatePages` configuration will not be used. */
  pagesConfig: undefined,

  /** These options are used to find the pages to serve via terra-dev-site. If 'pagesConfig' is provided, this
   * configuration is not used.
   * The file extensions pulled in are 'md' extensions and any extension defined in the resolve extensions set in the webpack config.
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

  /** The root-level npm package.json file. Change this if you have a non-standard package.json path.
   * Defaults to the <root_dir>/package.json
   */
  npmPackage,

  /* The list of side effect js files. */
  sideEffectImports: [],

  /* Path to the image to display as page placeholder when a component does not render. */
  placeholderSrc: path.join(__dirname, '..', '..', 'terra.png'),

  /* The README content to display on the home page. Set to undefined to opt out. */
  readMeContent: path.resolve(process.cwd(), 'README.md'),

  appConfig: {
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
     *
     * NOTE: This configuration has been deprecated as of terra-dev-site 6.23.0
     * locales: i18nSupportedLocales,
     */

    /* The default locale of the site. 'en' is the default theme. */
    defaultLocale: 'en',

    /* The default direction of the site. 'ltr' is the default direction. */
    defaultDirection: 'ltr',

    /** This section allows you to set custom extensions.
     * Extensions will be launched in a modal manager. All fields are required.
     *  Add like:
     *  extensions: [
     * {
     *     iconPath: 'terra-icon/lib/icon/IconSend',
     *     key: 'terra-dev-site.search',
     *     text: 'text',
     *     componentPath: '../path/to/component',
     *     size: 'small',
     *   },
     * ],
     */
    extensions: [],

    /** This section allows you to inject arbitrary html into the head tag of index.html.
     *  It takes an array of strings. You could load the string from an external file if desired.
     *  Add like:
     *  headHtml:[
     *    '<script> console.log("Terra Dev Site!") </script>',
     *  ],
     */
    headHtml: [],

  },

  /* The default for whether or not test evidence should be included. 'true' is the default value. */
  includeTestEvidence: true,
};

module.exports = siteConfig;
