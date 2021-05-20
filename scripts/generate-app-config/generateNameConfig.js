const ImportAggregator = require('./generation-objects/ImportAggregator');

/**
* Generates the file representing app name configuration.
*/
const generateNameConfig = (appConfig) => {
  const imports = new ImportAggregator();
  const config = {
    title: appConfig.title,
    ...appConfig.headline && { headline: appConfig.headline },
    ...appConfig.subline && { subline: appConfig.subline },
  };

  return { config, imports };
};

module.exports = generateNameConfig;
