const fse = require('fs-extra');
const path = require('path');
const writeConfig = require('./write-config');
const generateNavAndRouteConfig = require('./generateNavAndRouteConfig');
const ConfigureUtilities = require('./ConfigureUtilities');
// const siteConfig = require('./config/site.config');


const generateAppConfig = (siteConfig) => {
  const { appConfig, componentConfig } = siteConfig;

  const rootPath = path.join(process.cwd(), 'dev-site-config');
  const buildPath = path.join(rootPath, 'build');

  const utilityConfig = ConfigureUtilities.generateInitialUtiltiesConfig(appConfig);

  // const { routeConfig, navigation } = generateNavAndRouteConfig(siteConfig, componentConfig);

  // let appLogo;
  // if (appConfig.logoSrc) {
  //   appLogo = (<Image variant="rounded" src={appConfig.logoSrc} height="26px" width="26px" isFluid />);
  // }

  const config = {
    nameConfig: {
      // accessory: appLogo,
      title: appConfig.title,
    },
    // utilityConfig
    // routingConfig
    // navigationItems
    // extensions
    // indexPath
    defaultLocale: appConfig.defaultLocale,
    defaultDir: appConfig.defaultDirection,
    defaultTheme: appConfig.defaultTheme,
    themes: appConfig.themes,
  };

  // writeConfig(routeConfig, 'routeConfig.js', buildPath, fse);
  // writeConfig(navigation, 'navigationConfig.js', buildPath, fse);
  writeConfig(utilityConfig, 'util.config.js', buildPath, fse);
  writeConfig(config, 'app.config.js', buildPath, fse);
};

module.exports = generateAppConfig;
