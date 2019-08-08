const path = require('path');
const fs = require('fs');
const defaultConfig = require('../../config/site/site.config.js');

let siteConfig;

/**
* Determine if the path resolves to a file.
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
 * the default config path and then merge with the default config or it will just return the default site config.
 */
const loadSiteConfig = (configPath) => {
  if (siteConfig) {
    return siteConfig;
  }
  siteConfig = defaultConfig;
  // Merge the provided site config with the defaults
  if (configPath) {
    siteConfig = applyDefaults(path.resolve(configPath));
  }

  // Try to find the site config at the default path and then merge it with the defaults.
  const localConfig = resolve(path.resolve(process.cwd(), 'dev-site-config', 'site.config.js'));
  if (localConfig) {
    siteConfig = localConfig;
  }

  // Return the default config.
  return siteConfig;
};

module.exports = loadSiteConfig;
