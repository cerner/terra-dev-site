import i18nSupportedLocales from 'terra-i18n/lib/i18nSupportedLocales';

module.exports = {
  /* The path to the navigation configuration.  */
  navConfig: undefined,

  /** The array of pathes and/or regex patterns to the page and tests examples
    * of the components which should be pulled into the site. These will be
    * supplyed to the generate-component-config script, which will generate the
    * expected configuration needs to generate the react-router-routes and
    * component renderings.
    */
  examplePaths: [],

  /** Disables the generation of page examples component configuration in the
    * generated-component-config script.
    */
  disablePages: false, // maps to --no-pages

  /** Disables the generation of test examples component configuration in the
    * generated-component-config script.
    */
  disableTests: false, // maps to --no-tests

  /** The comopnent configuration. When provided, the generate-component-configureApp
    * script will not run.
    */
  componentConfig: undefined,

  /* If enabled, the xfc Provider will be used. */
  // hasIframes: false,

  appConfig: {
    /* The loge the site header should display. */
    logoSrc: '', // maps to appLogoSrc

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
