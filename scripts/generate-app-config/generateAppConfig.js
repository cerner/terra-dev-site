const fse = require('fs-extra');
const path = require('path');
const writeConfig = require('./writeConfig');
const generateNavAndRouteConfig = require('./generateNavAndRouteConfig');
const ConfigureUtilities = require('./ConfigureUtilities');
const ImportAggregator = require('./generation-objects/ImportAggregator');

const generateAppConfig = (siteConfig) => {
  const { appConfig, componentConfig } = siteConfig;

  const rootPath = path.join(process.cwd(), 'dev-site-config');
  const buildPath = path.join(rootPath, 'build');

  const utilityConfig = ConfigureUtilities.generateInitialUtiltiesConfig(appConfig);

  const { routes, navigation, indexPath } = generateNavAndRouteConfig(siteConfig, componentConfig);

  // console.log('requries', componentsToRequire);
  // let appLogo;
  // if (appConfig.logoSrc) {
  //   appLogo = (<Image variant="rounded" src={appConfig.logoSrc} height="26px" width="26px" isFluid />);
  // }

  const imports = new ImportAggregator();

  const config = {
    nameConfig: {
      // accessory: appLogo,
      title: appConfig.title,
    },
    utilityConfig: imports.addImport('./utilConfig', 'utilityConfig'),
    routingConfig: imports.addImport('./routeConfig', 'routeConfig'),
    navigationItems: imports.addImport('./navigationConfig', 'navigationConfig'),
    // extensions
    indexPath,
    defaultLocale: appConfig.defaultLocale,
    defaultDir: appConfig.defaultDirection,
    defaultTheme: appConfig.defaultTheme,
    themes: appConfig.themes,
  };

  writeConfig(routes, 'routeConfig.js', buildPath, fse);
  writeConfig(navigation, 'navigationConfig.js', buildPath, fse);
  writeConfig(utilityConfig, 'utilConfig.jsx', buildPath, fse);

  writeConfig({ config, imports }, 'app.config.js', buildPath, fse);
};

module.exports = generateAppConfig;
