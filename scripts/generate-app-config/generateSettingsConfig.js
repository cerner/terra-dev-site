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
    defaultLocale: appConfig.defaultLocale,
    defaultDirection: appConfig.defaultDirection,
  };

  return {
    config,
  };
};

module.exports = generateUtilitiesConfig;
