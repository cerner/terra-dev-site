const path = require('path');
const fs = require('fs');
const defaultConfig = require('../../config/site/site.config.js');

const isFile = filePath => (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory());

const resolve = (filePath) => {
  if (isFile(filePath)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(filePath);
  }
  return undefined;
};

const loadDefaultSiteConfig = (configPath) => {
  if (configPath) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(path.resolve(configPath));
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
