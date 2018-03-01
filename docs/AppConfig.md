# Application Configuration
Terra-dev-site uses the app configuration to build the site application and enable the application utilities to switch the site's theme, locale and/or directionality. Terra-dev-site package provides a [default app config](https://github.com/cerner/terra-dev-site/blob/master/src/config/site.config.js#L17) that is easy to customize by overriding the default value.


#### Application Configuration Options

Name | Type | Description
--- | ---  | ---
logoSrc | string | The logo the site header should display. Defaults to undefined.
title | string | The title the site header should display. Defaults to a blank title.
themes | object | The themes to supply the ThemeProvider which allows the site to switch between themes. Providing multiple key-value pairs enables the theme utility to display in the header's toolbar. The key should be the theme name, while the value is the sass theme name.
defaultTheme | string | The default theme of the site. **Note:** this value should be a key that was supplied to the `themes` object. The open-sourced theme is the default theme.
locales | array of strings | The locales to supply Base with, which allows the site to switch between locales. By default, The [i18nSupportedLocales](https://github.com/cerner/terra-core/blob/master/packages/terra-i18n/src/i18nSupportedLocales.js) are provide.
defaultLocale | string |  The default locale of the site. Defaults to 'en'.
bidirectional | boolean |  Indicates if the site supports bidirectionally. If enabled, the directionality utility will display in the toolbar. Defaults to true.
defaultDirection | string | The default direction of the site. Defaults to 'ltr'.
