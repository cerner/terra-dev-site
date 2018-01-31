const i18nSupportedLocales = require('terra-i18n/lib/i18nSupportedLocales');
const navigationConfig = require('./navigation.config');

module.exports = {
  /* The navigation configuration.  */
  navConfig: navigationConfig,

  /* The path to the component configuration. */
  componentConfigPath: './generatedComponentConfig.js',

  /* The image to display as page placeholder when a component does not render. */
  placeholderSrc: '',

  /* The README content to display on the home page. */
  readMeContent: '',

  appConfig: {
    /* The loge the site header should display. */
    logoSrc: undefined, // maps to appLogoSrc

    /* The title the site header should display. */
    title: '', // maps to appTitle

    /* The subtitle the site header should display. */
    subtitle: '', // maps to appSubtitle

    /** The themes to supply the ThemeProvider which allows the site to switch
      * between themes. Providing multiple enables the theme utility to display
      * in the header's toolbar.
      */
    themes: {
      'Default Theme': '',
    },

    /* The default theme of the site. The open-sourced theme is the default theme. */
    defaultTheme: 'Default Theme',

    /** The locales to supply Base with, which allows the site to switch
      * between locales. English is the default language.
      */
    locales: i18nSupportedLocales,

    /** Indicates if the site supports bidirectionality. If enabled, the directionality
      * utility will display in the toolbar.
      */
    bidirectional: true, // maps to hideBidiUtility


    /* The default direction of the site. 'ltr' is the default direction. */
    defaultDirection: 'ltr',
  },
};
