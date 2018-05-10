const i18nSupportedLocales = require('terra-i18n/lib/i18nSupportedLocales');
const navConfig = require('./navigation.config');
const startCase = require('lodash.startcase');
const fs = require('fs');
const path = require('path');

const npmPackage = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json')));

const siteConfig = {
  /* The navigation configuration.  */
  navConfig,

  /* The path to the component configuration. */
  // componentConfig: {},
  /* PagesConfig */
  // pagesConfig,

  // These options are used to find the pages to serve via terra dev site.
  // If 'pagesConfig' is provided, no pages will be generated.
  // Output:
  // {roots}/lib/{entryPointDirs}/**/**/*{pageType}.{jsx,js}
  // {roots}/packages/*/lib/{entryPointDirs}/**/*{pageType}.{jsx,js}
  // searchPatterns
  // *NOTE* The entryPointDirs also act as the beginning of the directory strucure for menu navigation.
  // For example: /root/src/<entryPointDir>/folder/item would start navigation at 'folder'.
  // The entryPointDirs will be applied to all pages regardless of the type or search pattern that found it.
  generatePages: {
    searchPatterns: [
      {
        root: process.cwd(),
        source: 'src',
        dist: 'lib',
        entryPoint: 'terra-dev-site',
      },
    ],
    customPatterns: [
      // {
      //   pattern: 'dir/lib/terra-dev-site/**/*.<type>.{jsx,js})',
      //   entryPoint: 'terra-dev-site',
      // },
    ],
  },

  hotReloading: {
    enabled: true,
    source: 'src',
    dist: 'lib',
  },

  webpackAliases: {
    // [path]: <path location>
  },

  monoRepoPackageDir: path.resolve(process.cwd(), 'packages'),

  npmPackage,

  /* The image to display as page placeholder when a component does not render. */
  placeholderSrc: 'https://github.com/cerner/terra-dev-site/raw/master/terra.png',

  /* The README content to display on the home page. */
  readMeContent: path.resolve(process.cwd(), 'README.md'),

  appConfig: {
    /* The loge the site header should display. */
    logoSrc: 'https://github.com/cerner/terra-dev-site/raw/master/terra.png', // maps to appLogoSrc

    /* The title the site header should display. */
    title: startCase(npmPackage.name), // maps to appTitle

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
    bidirectional: true, // maps to hideBidiUtility


    /* The default direction of the site. 'ltr' is the default direction. */
    defaultDirection: 'ltr',

    /* Configuration relating to the extensions section of the site. Not rendered if extensions are supplied by navigation config */
    // extensions: {
    // //    The url to link to github. If this is supplied a github extention will be display to link to the supplied url
    //   gitHubUrl: 'https://github.com/cerner',
    // },
  },
};

module.exports = siteConfig;
