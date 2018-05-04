const path = require('path');
const fs = require('fs');
const defaultConfig = require('../../config/site/site.config.js');

const isFile = filePath => (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory());

const applyDefaults = (filePath) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const config = require(filePath);

  config.appConfig = Object.assign({}, defaultConfig.appConfig, config.appConfig);

  return Object.assign({}, defaultConfig, config);
};

const resolve = (filePath) => {
  if (isFile(filePath)) {
    return applyDefaults(filePath);
  }

  return undefined;
};

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
