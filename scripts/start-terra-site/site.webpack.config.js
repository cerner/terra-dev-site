const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
// const generateComponentConfig = require('../generate-component-config/generate-component-configDyanmic');

const isFile = filePath => (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory());

/* Get the site configuration */
const siteConfigPath = path.resolve(path.join(process.cwd(), 'site.config.js'));
// eslint-disable-next-line import/no-dynamic-require
const siteConfig = isFile(siteConfigPath) ? require(siteConfigPath) : require('../../src/config/site.config');

/* Get the webpacak configuration */
let webpackConfigPath;
if (siteConfig.webpackConfig) {
  webpackConfigPath = path.resolve(path.join(process.cwd(), `${siteConfig.webpackConfig}`));
}
// eslint-disable-next-line import/no-dynamic-require
const webpackConfig = isFile(webpackConfigPath) ? require(webpackConfigPath) : require('../../src/config/webpack.config');

/* Get the component configuration */
let componentConfigPath = path.resolve(path.join(process.cwd(), siteConfig.componentConfigPath));
// let componentConfig;
if (!isFile(componentConfigPath)) {
  componentConfigPath = undefined;
}
// else {
//   componentConfig = generateComponentConfig(siteConfig.examplePaths, siteConfig.disablePages, siteConfig.disableTests);
// }

const globalVarsPlugin = new webpack.DefinePlugin({
  SITE_CONFIG: JSON.stringify(siteConfig),
  COMPONENT_CONFIG_PATH: JSON.stringify(componentConfigPath),
  // COMPONENT_CONFIG: JSON.stringify(componentConfig),
});

const webpackConfiguration = () => {
  webpackConfig.plugins.push(globalVarsPlugin);
  return webpackConfig;
};

module.exports.default = webpackConfiguration;
