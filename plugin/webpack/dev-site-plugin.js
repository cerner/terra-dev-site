const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const generateAppConfig = require('../../scripts/generate-app-config/generateAppConfig');
const loadSiteConfig = require('../../scripts/generate-app-config/loadSiteConfig');
const getNewRelicJS = require('../../scripts/new-relic/getNewRelicJS');

class DevSitePlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const processPath = process.cwd();
    const devSiteConfigPath = path.resolve(path.join(processPath, 'dev-site-config'));
    // console.log(compiler);
    compiler.options.resolve.modules.push([devSiteConfigPath]);

    new HtmlWebpackPlugin({
      filename: '404.html',
      template: path.join(__dirname, '..', '..', 'lib', '404.html'),
      inject: 'head',
      chunks: ['redirect'],
    }).apply(compiler);

    // compiler.options.plugins.
    console.log('[VIKING] options', this.options);
    // compiler.hooks.entryOption.tap('terra-dev-site', (context, entry) => {
    //   // console.log('[VIKING] entry', entry);
    //   new SingleEntryPlugin(context, path.resolve(path.join(__dirname, '..', 'lib', 'Index')), 'terra-dev-site').apply(compiler);
    //   new SingleEntryPlugin(context, path.resolve(path.join(__dirname, '..', 'lib', 'rewriteHistory')), 'rewriteHistory').apply(compiler);
    //   new SingleEntryPlugin(context, path.resolve(path.join(__dirname, '..', 'lib', 'redirect')), 'redirect').apply(compiler);
    //   // return true;
    // });

    // compiler.hooks.thisCompilation.tap('terra-dev-site', (compilation) => {
    //   compilation.hooks.buildModule.tap('terra-dev-site', (module) => {
    //     // console.log('[VIKING] module', module);
    //     // const processPath = process.cwd();
    //     // const devSiteConfigPath = path.resolve(path.join(processPath, 'dev-site-config'));
    //     console.log('[VIKING] module', module.resolveOptions.modules);
    //     // module.resolveOptions = {
    //     //   modules: [devSiteConfigPath],
    //     // };
    //   });
    // });

    // compiler.hooks.compilation.tap('terra-dev-site', (compilation, compilationParams) => {
    //   // console.log('[VIKING] entrypoints', Object(compilation.entries).keys());

    //   // return true;
    // });

    // compiler.resolverFactory.hooks.resolveOptions.for('normal')
    //   .tap('terra-dev-siteOptionsApply', (resolveOptions) => {
    //     console.log('[VIKING] options', resolveOptions);
    //     return resolveOptions;
    //   });
  }
}

module.exports = DevSitePlugin;
