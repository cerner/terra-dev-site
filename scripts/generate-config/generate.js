const fse = require('fs-extra');
const path = require('path');
const writeConfig = require('./write-config');
const generateAppConfig = require('./generateAppConfig');
// const siteConfig = require('./config/site.config');


const generate = (siteConfig) => {
  const { appConfig, componentConfig } = siteConfig;

  const rootPath = path.join(process.cwd(), 'dev-site-config');
  const buildPath = path.join(rootPath, 'build');

  const { routeConfig, navigation } = generateAppConfig(siteConfig, componentConfig);

  // const config = {};

  writeConfig(routeConfig, 'routeConfig.js', buildPath, fse);
  writeConfig(navigation, 'navigationConfig.js', buildPath, fse);
  writeConfig(appConfig, 'appConfig.js', buildPath, fse);
};

module.exports = generate;
