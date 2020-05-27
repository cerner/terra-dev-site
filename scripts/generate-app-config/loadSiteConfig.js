const path = require('path');
const fs = require('fs');

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

  config.appConfig = { ...defaultConfig.appConfig, ...config.appConfig };

  return { ...defaultConfig, ...config };
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
const loadSiteConfig = (configName = 'site.config.js', defaultPath = '../../config/site/site.config.js') => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const defaultConfig = require(defaultPath);
  let projectConfig = defaultConfig;

  // Try to find the site config at the default path and then merge it with the defaults.
  const localConfig = resolve(path.resolve(process.cwd(), 'dev-site-config', configName), defaultConfig);
  if (localConfig) { projectConfig = localConfig; }

  // Try to find the locale configs at the default path and override defaults if present.
  const localLocaleConfig = path.resolve(process.cwd(), 'terraI18n.config.js');
  if (isFile(localLocaleConfig)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const config = require(localLocaleConfig);
    if (config.locales) { projectConfig.locales = config.locales; }
  }
  // Return the default config.
  return projectConfig;
};

module.exports = loadSiteConfig;
