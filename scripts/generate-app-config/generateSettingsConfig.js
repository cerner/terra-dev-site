/**
* Build utilities config file.
*/
const generateUtilitiesConfig = (appConfig) => {
  if (!appConfig) {
    return undefined;
  }

  // build out the menu items for themes, locals, and bidi.
  const config = {
    defaultTheme: appConfig.defaultTheme,
    themes: appConfig.themes || {},
    defaultLocale: appConfig.defaultLocale,
    locales: appConfig.locales || [],
    defaultDirection: appConfig.defaultDirection,
    directions: ['ltr', 'rtl'],
  };

  return {
    config,
  };
};

module.exports = generateUtilitiesConfig;
