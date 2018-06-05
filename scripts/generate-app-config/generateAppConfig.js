const fse = require('fs-extra');
const path = require('path').posix;
const glob = require('glob');
const writeConfig = require('./writeConfig');
const generateRouteConfig = require('./generateRouteConfig');
const generateNameConfig = require('./generateNameConfig');
const generateExtensions = require('./generateExtensions');
const generateUtilitiesConfig = require('./generateUtilitiesConfig');
const generateNavigationItems = require('./generateNavigationItems');
const generatePagesConfig = require('./generatePagesConfig');
const ImportAggregator = require('./generation-objects/ImportAggregator');

/**
* Writes out a file consisting of the config and imports with the given file name to the specified path.
* Returns an object representing an imported variable.
*/
const addConfig = (config, fileName, buildPath, fs, imports) => {
  if (config) {
    writeConfig(config, fileName, buildPath, fse);
    const { name } = path.parse(fileName);
    return imports.addImport(`./${name}`, name);
  }
  return undefined;
};

/**
* Resolve relative paths that start with '.', then glob paths, then apply side effect imports
*/
const importSideEffects = (sideEffects, imports) => {
  sideEffects.map(sideEffectGlob =>
    (sideEffectGlob.charAt(0) === '.' ? path.resolve('dev-site-config', sideEffectGlob) : sideEffectGlob)).reduce((acc, sideEffectGlob) =>
    acc.concat(glob.sync(sideEffectGlob)), []).forEach(sideEffectPath =>
    imports.addImport(ImportAggregator.relativePath(sideEffectPath)));
};

/**
* Writes out a file consisting of the app config and imports with the given file name to the specified path.
*/
const generateAppConfig = (siteConfig, production, verbose) => {
  const imports = new ImportAggregator();

  const {
    appConfig,
    navConfig,
    themeImports,
    sideEffectImports,
  } = siteConfig;

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

  const routingConfig = addConfig(
    generateRouteConfig(siteConfig, generatePagesConfig(siteConfig, production, verbose)),
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

  // Add any side-effect theme imports.
  importSideEffects(themeImports, imports);

  // Add any side-effect imports.
  importSideEffects(sideEffectImports, imports);

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
