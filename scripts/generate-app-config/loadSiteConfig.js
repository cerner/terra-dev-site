const path = require('path');
const fs = require('fs');
const applySiteConfigDefaults = require('./applySiteConfigDefaults');

// let siteConfig;

/**
* Determine if the path resolves to a file.
*/
const isFile = filePath => (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory());

/**
* Overlay the default site config on the custom site config.
*/
const applyDefaults = (filePath, defaultConfig) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const config = require(filePath);

  return applySiteConfigDefaults(config, defaultConfig);
};

/**
* If the file path is valid, merge the custom site config with the defaults.
*/
const resolve = (filePath, defaultConfig) => {
  if (isFile(filePath)) {
    return applyDefaults(filePath, defaultConfig);
  }

  return undefined;
};


/**
 * Returns the site configuration. It will attempt to load the configuration from the provided configPath first or
 * the default config path and then merge with the default config or it will just return the default site config.
 */
const loadSiteConfig = (configPath = undefined, defaultPath = '../../config/site/site.config.js') => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const defaultConfig = require(defaultPath);

  // Merge the provided site config with the defaults
  if (configPath) {
    return applyDefaults(path.resolve(configPath), defaultConfig);
  }

  // Try to find the site config at the default path and then merge it with the defaults.
  const localConfig = resolve(path.resolve(process.cwd(), 'dev-site-config', 'site.config.js'), defaultConfig);
  if (localConfig) {
    return localConfig;
  }

  // Return the default config.
  return defaultConfig;
};

module.exports = loadSiteConfig;
