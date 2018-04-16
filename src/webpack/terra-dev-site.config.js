
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const isFile = filePath => (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory());

const devSiteConfig = () => {
  const processPath = process.cwd();
  /* Get the root path of a mono-repo process call */
  const rootPath = processPath.includes('packages') ? processPath.split('packages')[0] : processPath;

  /* Get the site configuration to add as a resolve path */
  let devSiteConfigPath = path.resolve(path.join(rootPath, 'dev-site-config'));
  const customSiteConfigPath = path.join(devSiteConfigPath, 'site.config.js');
  if (!isFile(customSiteConfigPath)) {
    devSiteConfigPath = path.join('src', 'config');
  }

  return {
    entry: {
      'terra-dev-site': path.resolve(path.join(__dirname, '..', 'Index')),
    },
    plugins: [new HtmlWebpackPlugin({
      title: 'Site',
      template: path.join(__dirname, '..', 'index.html'),
    })],
    resolve: {
      modules: [devSiteConfigPath],
    },
  };
};

module.exports = devSiteConfig;
