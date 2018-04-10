
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const defaultWebpackConfig = require('terra-toolkit/lib/webpack/webpack.config');

const isFile = filePath => (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory());

const processPath = process.cwd();
/* Get the root path of a mono-repo process call */
const rootPath = processPath.includes('packages') ? processPath.split('packages')[0] : processPath;

/* Get the site configuration to add as a resolve path */
let devSiteConfigPath = path.resolve(path.join(rootPath, 'dev-site-config'));
const customSiteConfigPath = path.join(devSiteConfigPath, 'site.config.js');
devSiteConfigPath = isFile(customSiteConfigPath) ? devSiteConfigPath : path.join('src', 'config');

defaultWebpackConfig.entry['terra-dev-site'] = path.resolve(path.join(__dirname, '..', 'Index'));
defaultWebpackConfig.plugins.push(new HtmlWebpackPlugin({
  title: 'Site',
  template: path.join(__dirname, '..', 'index.html'),
}));
defaultWebpackConfig.resolve.modules.unshift(devSiteConfigPath);

module.exports = defaultWebpackConfig;
