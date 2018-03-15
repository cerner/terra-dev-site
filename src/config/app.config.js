const i18nSupportedLocales = require('terra-i18n/lib/i18nSupportedLocales');

module.exports = {
  /* The logo the site header should display. */
  logoSrc: undefined, // maps to appLogoSrc

  /* The title the site header should display. */
  title: '', // maps to appTitle

  /** The themes to supply the ThemeProvider which allows the site to switch
    * between themes. Providing multiple key-value pairs enables the theme
    * utility to display in the header’s toolbar. The key should be the theme
    * name, while the value is the sass theme name.
    */
  themes: {
    'Default Theme': '',
  },

  /** The default theme of the site. Note: this value should be a key that was
    * supplied to the themes object. The open-sourced theme is the default
    * theme.
    */
  defaultTheme: 'Default Theme',

  /** The locales to supply Base with, which allows the site to switch
    * between locales.
    */
  locales: i18nSupportedLocales,

  /* The default locale of the site. */
  defaultLocale: 'en',

  /** Indicates if the site supports bidirectionally. If enabled, the directionality
    * utility will display in the toolbar.
    */
  bidirectional: true, // maps to hideBidiUtility


  /* The default direction of the site.  */
  defaultDirection: 'ltr',
};
