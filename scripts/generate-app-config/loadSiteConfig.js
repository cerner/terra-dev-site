const path = require('path').posix;
const fs = require('fs');
const defaultConfig = require('../../config/site/site.config.js');

/**
* Detemine if the path resolves to a file.
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
* If the file path is valid, merge the custom site config with the defaults.
*/
const resolve = (filePath) => {
  if (isFile(filePath)) {
    return applyDefaults(filePath);
  }

  return undefined;
};


/**
 * Returns the site configuration. It will attempt to load the configuration from the provided configPath first or
 * the defualt config path and then merge with the default config or it will just return the default site config.
 */
const loadSiteConfig = (configPath) => {
  // Merge the provided site config with the defaults
  if (configPath) {
    return applyDefaults(path.resolve(configPath));
  }

  // Try to find the site config at the defualt path and then merge it with the defaults.
  const localConfig = resolve(path.resolve(process.cwd(), 'dev-site-config', 'site.config.js'));
  if (localConfig) {
    return localConfig;
  }

  // Return the default config.
  return defaultConfig;
};

module.exports = loadSiteConfig;
