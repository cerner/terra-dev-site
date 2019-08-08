const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const generateAppConfig = require('../../scripts/generate-app-config/generateAppConfig');
const loadSiteConfig = require('../../scripts/generate-app-config/loadSiteConfig');
const getNewRelicJS = require('../../scripts/new-relic/getNewRelicJS');

const indexPlugin = ({
  title, filename, lang, rootElementId = 'root', siteConfig, indexEntryPoints, entry,
}) => {
  const otherIndexChunks = indexEntryPoints.filter(indexEntry => indexEntry !== entry);
  return new HtmlWebpackPlugin({
    title,
    filename,
    template: path.join(__dirname, '..', '..', 'lib', 'index.html'),
    lang,
    rootElementId,
    dir: siteConfig.appConfig.defaultDirection,
    favicon: siteConfig.appConfig.favicon,
    headHtml: [getNewRelicJS()].concat(siteConfig.appConfig.headHtml),
    headChunks: ['rewriteHistory'],
    excludeChunks: ['redirect', ...otherIndexChunks],
    inject: false, // This turns off auto injection. We handle this ourselves in the template.
  });
};

class TerraDevSitePlugin {
  constructor({ env, siteConfig } = {}) {
    this.env = env;
    this.siteConfig = siteConfig || loadSiteConfig();
    this.lang = env.defaultLocale || this.siteConfig.appConfig.defaultLocale;
  }

  apply(compiler) {
    // Load the site configuration.
    const production = compiler.options.mode === 'production';
    const processPath = process.cwd();

    // GENERATE
    // Generate the files need to spin up the site.
    generateAppConfig(this.siteConfig, production, false);

    // OUTPUT
    const publicPath = compiler.options.output.publicPath || process.env.TERRA_DEV_SITE_PUBLIC_PATH || '/';
    compiler.options.output.publicPath = publicPath;

    // Strip the trailing / from the public path.
    const basename = publicPath.slice(0, -1);
    new webpack.DefinePlugin({
      // Base name is used to namespace terra-dev-site
      TERRA_DEV_SITE_BASENAME: JSON.stringify(basename),
    }).apply(compiler);

    // RESOLVE
    const devSiteConfigPath = path.resolve(path.join(processPath, 'dev-site-config'));
    compiler.options.resolve.modules.push([devSiteConfigPath]);

    // indexes
    const indexEntryPoints = [];
    indexEntryPoints.push('terra-dev-site');
    // terra-dev-site index.html
    indexPlugin({
      title: this.siteConfig.appConfig.title,
      filename: 'index.html',
      lang: this.lang,
      siteConfig: this.siteConfig,
      indexEntryPoints,
      entry: 'terra-dev-site',
    }).apply(compiler);

    new HtmlWebpackPlugin({
      filename: '404.html',
      template: path.join(__dirname, '..', '..', 'lib', '404.html'),
      inject: 'head',
      chunks: ['redirect'],
    }).apply(compiler);


    // WEBPACK DEV SERVER
    compiler.options.devServer.historyApiFallback = true;

    // DEVTOOL
    if (production) {
      compiler.options.devtool = 'source-map';
    }

    console.log('[VIKING] options', this.options);
  }
}

module.exports = TerraDevSitePlugin;
