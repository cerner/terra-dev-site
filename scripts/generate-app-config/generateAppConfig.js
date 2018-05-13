const fse = require('fs-extra');
const path = require('path');
const writeConfig = require('./writeConfig');
const generateRouteConfig = require('./generateRouteConfig');
const generateNameConfig = require('./generateNameConfig');
const generateExtensions = require('./generateExtensions');
const generateUtilitiesConfig = require('./generateUtilitiesConfig');
const generateNavigationItems = require('./generateNavigationItems');
const generatePagesConfig = require('./generatePagesConfig');
const ImportAggregator = require('./generation-objects/ImportAggregator');

/**
* Writes out a file consiting of the config and imports with the given file name to the specified path.
* Returns an object representing an imported variable.
*/
const addConfig = (config, fileName, buildPath, fs, imports) => {
  if (config) {
    writeConfig(config, fileName, buildPath, fse);
    const name = path.parse(fileName).name;
    return imports.addImport(`./${name}`, name);
  }
  return undefined;
};

/**
* Writes out a file consiting of the config and imports with the given file name to the specified path.
* Returns an object representing an imported variable.
*/
const generateAppConfig = (siteConfig, production) => {
  const imports = new ImportAggregator();

  const { appConfig, themeImports } = siteConfig;

  const rootPath = path.join(process.cwd(), 'dev-site-config');
  // This is where we are writing out the generated files.
  const buildPath = path.join(rootPath, 'build');

  const utilityConfig = addConfig(
    generateUtilitiesConfig(appConfig),
    'utilityConfig.jsx',
    buildPath,
    fse,
    imports,
  );

  const nameConfig = addConfig(
    generateNameConfig(appConfig),
    'nameConfig.js',
    buildPath,
    fse,
    imports,
  );

  // Nav config is modified by the generate route config method. Make sure it's called before witing the navigation items.
  const { navConfig, ...routeConfig } = generateRouteConfig(siteConfig, generatePagesConfig(siteConfig, production));
  const routingConfig = addConfig(
    routeConfig,
    'routeConfig.js',
    buildPath,
    fse,
    imports,
  );

  const navigationItems = addConfig(
    generateNavigationItems(navConfig),
    'navigationItems.js',
    buildPath,
    fse,
    imports,
  );

  const extensions = addConfig(
    generateExtensions(appConfig),
    'extensions.jsx',
    buildPath,
    fse,
    imports,
  );

  // Add any side-effect theme imports
  themeImports.forEach(themePath => imports.addImport(ImportAggregator.relativePath(themePath)));

  // Building out the overall config import.
  const config = {
    nameConfig,
    utilityConfig,
    routingConfig,
    navigationItems,
    extensions,
    indexPath: navConfig.navigation.index,
    defaultLocale: appConfig.defaultLocale,
    defaultDir: appConfig.defaultDirection,
    defaultTheme: appConfig.defaultTheme,
    themes: appConfig.themes,
  };

  writeConfig({ config, imports }, 'appConfig.js', buildPath, fse);
};

module.exports = generateAppConfig;
