/**
* Overlay the default site config on the custom site config.
*/
const applySitConfigDefaults = (config, defaultConfig) => {
  const combinedConfig = Object.assign({}, defaultConfig, config);
  combinedConfig.appConfig = Object.assign({}, defaultConfig.appConfig, config.appConfig);

  return combinedConfig;
};

module.exports = applySitConfigDefaults;
