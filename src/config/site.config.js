import i18nSupportedLocales from 'terra-i18n/lib/i18nSupportedLocales';
import navigationConfig from './navigation.config';

const siteConfig = {
  /* The navigation configuration.  */
  navConfig: navigationConfig,

  /* The path to the component configuration. */
  componentConfig: {},

  /* The image to display as page placeholder when a component does not render. */
  placeholderSrc: '',

  /* The README content to display on the home page. */
  readMeContent: '',

  appConfig: {
    /* The loge the site header should display. */
    logoSrc: undefined, // maps to appLogoSrc

    /* The title the site header should display. */
    title: '', // maps to appTitle

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
  },
};

export default siteConfig;
