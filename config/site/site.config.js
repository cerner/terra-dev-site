const startCase = require('lodash.startcase');
const fs = require('fs');
const path = require('path');

const npmPackage = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));

const siteConfig = {
  /* The navigation configuration. */
  navConfig: {
    navigation: {
      /* The first page to route to for the site. */
      index: '/home',
      /** List of top level nav items.
       *   Link config options:
       *      path: Path to the link.
       *      text: The text to display on the navigation link.
       *      pageType: The page extension that should be displayed under this link.
       *      capabilities: an object describing the capabilities of all pages listed under the specified path.
       *          devTools: display development tools to allow switching between locales and themes.
       */
      links: [{
        path: '/home',
        text: 'Home',
        pageType: 'home',
      }, {
        path: '/components',
        text: 'Components',
        pageType: 'doc',
        capabilities: {
          devTools: true,
        },
      }, {
        path: '/tests',
        text: 'Tests',
        pageType: 'test',
        capabilities: {
          devTools: true,
        },
      }],
    },
  },

  /** These options are used to find the pages to serve via terra-dev-site.
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

    /** The default theme of the site. Note, this value should be a key that was
     * supplied to the themes object.
     */
    // defaultTheme: 'terra-default-theme',

    /* The default locale of the site. 'en' is the default theme. */
    // defaultLocale: 'en',

    /* The default direction of the site. 'ltr' is the default direction. */
    // defaultDirection: 'ltr',

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
};

module.exports = siteConfig;
