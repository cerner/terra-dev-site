/**
* Build utilities config file.
*/
const generateUtilitiesConfig = (appConfig, locale) => {
  if (!appConfig) {
    return undefined;
  }

  // build out the menu items for themes, locals, and bidi.
  const config = {
    defaultTheme: appConfig.defaultTheme,
    themes: appConfig.themes || {},
    defaultLocale: locale || appConfig.defaultLocale,
    locales: appConfig.locales || {},
    defaultDirection: appConfig.defaultDir,
    directions: ['ltr', 'rtl'],
  };

  return {
    config,
  };
};

module.exports = generateUtilitiesConfig;
