const path = require('path');
const fs = require('fs');
const defaultConfig = require('../../config/site/site.config.js');

/**
* Does the file path resolve to a file?
*/
const isFile = filePath => (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory());

/**
* Overlay the default site config on the custom site config.
*/
const applyDefaults = (filePath) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const config = require(filePath);

  config.appConfig = Object.assign({}, defaultConfig.appConfig, config.appConfig);

  return Object.assign({}, defaultConfig, config);
};

/**
* Resolve teh possible custom site config.
*/
const resolve = (filePath) => {
  if (isFile(filePath)) {
    return applyDefaults(filePath);
  }

  return undefined;
};

/**
* Finds the default site config, either the passed in config, the site config in the packages dev-site-config file or the default site config.
*/
const loadDefaultSiteConfig = (configPath) => {
  if (configPath) {
    return applyDefaults(path.resolve(configPath));
  }

  // First try to find the local to process.cwd webpack config
  const localConfig = resolve(path.resolve(process.cwd(), 'dev-site-config', 'site.config.js'));
  if (localConfig) {
    return localConfig;
  }

  // If that is not found look for the terra-dev-site config.
  return defaultConfig;
};

module.exports = loadDefaultSiteConfig;
