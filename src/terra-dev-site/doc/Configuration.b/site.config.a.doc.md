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
  /* The navigation configuration. */
  navConfig,

  /* The path to the pages configuration. If this is enabled, the `generatePages` configuration will not be used. */
  pagesConfig,

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
      // In Prod & Dev & !hotReloading: Searches rootPaths/terra-dev-site/**/*{pageTypes}.{jsx,js,md,}
      // In Prod & Dev & !hotReloading: Searches rootPaths/packages/*/terra-dev-site/**/*{pageTypes}.{jsx,js,md,}
      {
        root: process.cwd(),
        entryPoint: 'terra-dev-site',
      },
      // In Prod & Dev & !hotReloading: Searches rootPaths/dist/examples/**/*{pageTypes}.{jsx,js,md,}
      // In Prod & Dev & !hotReloading: Searches rootPaths/packages/*/dist/examples/**/*{pageTypes}.{jsx,js,md,}
      {
        root: process.cwd(),
        dist: 'dist',
        entryPoint: 'examples',
      },
      // In Prod & !hotReloading: Searches rootPaths/lib/terra-dev-site/**/*{pageTypes}.{jsx,js,md,}
      // In Prod & !hotReloading: Searches rootPaths/packages/*/lib/terra-dev-site/**/*{pageTypes}.{jsx,js,md,}
      // In Dev & hotReloading: Searches rootPaths/src/terra-dev-site/**/*{pageTypes}.{jsx,js,md,}
      // In Dev & hotReloading: Searches rootPaths/packages/*/src/terra-dev-site/**/*{pageTypes}.{jsx,js,md,}
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

  /* The mono-repo package path. This is used to automatically alias package directories in webpack. We can support multiple */
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
    source: 'src',
    dist: 'lib',
  },

  /** The root-level npm package.json file. Change this if you have a non-standard package.json path.
   * Defaults to the <root_dir>/package.json
   */
  npmPackage,

  /* Side effect theme imports. */
  themeImports: [
    '../theme';
  ],

  /** The list of side effect js files.
   *  This list accepts globs, absolute paths and paths relative to dev-site-config/site.config
   */
  sideEffectImports: [
    '../src/random.js',
    'root/project/src/sideEffect.js'),
    '**/src/*.mock.js',
  ],

  /** Path to the image to display as page placeholder when a component does not render.
   * Defaulted to the terra logo from this repo.
   */
  placeholderSrc: '../logo.png',

  /** The README content to display on the home page.
   * Defaulted to the readme in the root directory.
   * Set to undefined to opt out.
   */
  readMeContent: '../README.md',

  appConfig: {
    /** Path to the logo the site header should display.
     * Defaulted to the terra logo from this repo.
     */
    logoSrc: '../logo.png',

    /** The title the site header should display.
     * Defaulted to the package name from the <root_dir>/package.json
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
     * between locales. Defaulted to the supported locals list in terra-18n.
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

    /* The configuration for adding the external extensions section of the site. */
    extensions: {
      /** The url to link to github. If this is supplied a github extension will be display with a link to the supplied url.
       * Defaulted to the repository url specified in the <root_dir>/package.json.
       */
      gitHubUrl: 'https://github.com/cerner',
    },

    /* The default for whether or not test evidence should be included. 'true' is the default value. */
    includeTestEvidence: true,
  },
};

module.exports = siteConfig;
```
