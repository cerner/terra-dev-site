
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const generateAppConfig = require('../../scripts/generate-app-config/generateAppConfig');
const loadDefaultSiteConfig = require('../../scripts/generate-app-config/loadDefaultSiteConfig');

const devSiteConfig = () => {
  const processPath = process.cwd();
  /* Get the root path of a mono-repo process call */
  const rootPath = processPath.includes('packages') ? processPath.split('packages')[0] : processPath;

  /* Get the site configuration to add as a resolve path */
  const devSiteConfigPath = path.resolve(path.join(rootPath, 'dev-site-config'));

  const siteConfig = loadDefaultSiteConfig();

  generateAppConfig(siteConfig);

  return {
    entry: {
      'terra-dev-site': path.resolve(path.join(__dirname, '..', '..', 'lib', 'Index')),
    },
    plugins: [new HtmlWebpackPlugin({
      title: 'Site',
      template: path.join(__dirname, '..', '..', 'lib', 'index.html'),
    })],
    resolve: {
      modules: [devSiteConfigPath],
      alias: {
        'terra-dev-site/lib': path.join(process.cwd(), 'src'), // hack
      },
    },
    watch: true,
  };
};

module.exports = devSiteConfig;
