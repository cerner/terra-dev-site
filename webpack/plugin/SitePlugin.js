/* eslint-disable no-param-reassign */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { DefinePlugin } = require('webpack');

const DirectorySwitcherPlugin = require('./resolve/DirectorySwitcherPlugin');
const LocalPackageAliasPlugin = require('./resolve/LocalPackageAliasPlugin');
const { babelLoader, mdxOptions, getMdxLoader } = require('./siteUtils');
const getNewRelicJS = require('../../scripts/new-relic/getNewRelicJS');

let oneTimeSetupComplete = false;
const siteRegistry = {};

/**
 * Updates the webpack options with defaults that terra-dev-site requires.
 */
class SitePlugin {
  constructor({ indexPath, config, applyDefaults } = {}) {
    this.config = applyDefaults(config);
    const { prefix, titleConfig } = this.config;

    if (prefix) {
      this.entryKey = `${prefix}/'index'}`;
      this.entry = { [this.entryKey]: indexPath };
      this.htmlFileName = `${prefix}/index.html`;
      this.url = `/${prefix}`;
    } else {
      this.entryKey = 'index';
      this.entry = { [this.entryKey]: indexPath };
      this.htmlFileName = 'index.html';
      this.url = '/';
    }
    if (siteRegistry[prefix]) {
      throw Error('site prefixes must be unique');
    }
    siteRegistry[prefix] = {
      path: prefix,
      url: this.url,
      title: titleConfig.title,
      entry: this.entryKey,
    };
  }

  static applyOneTimeSetup(compiler) {
    if (oneTimeSetupComplete) {
      console.log('Bailing on one time setup');
      return;
    }
    oneTimeSetupComplete = true;

    // Strip the trailing / from the public path.
    const basename = compiler.options.output.publicPath.slice(0, -1);

    const processPath = process.cwd();

    // MODULE
    const mdxLoader = getMdxLoader(compiler.options.output.publicPath);
    compiler.options.module.rules = [{
      // Drop loaders in a 'one of' block to avoid the original loaders applying on top of the new loaders.
      // Only the first loader will apply and no others.
      oneOf: [{
        test: /\.mdx$/,
        use: [
          babelLoader,
          mdxLoader,
        ],
      }, {
        test: /\.md$/,
        oneOf: [
          {
            // Use MDX to import any md files imported from an mdx file.
            issuer: [
              /\.mdx?$/,
              /\.dev-site-config-template$/,
            ],
            use: [
              babelLoader,
              mdxLoader,
            ],
          },
          {
            use: 'raw-loader',
          },
        ],
      }, {
        resourceQuery: /dev-site-codeblock/,
        // this bypasses the default json loader
        type: 'javascript/auto',
        use: [
          babelLoader,
          mdxLoader,
          {
            loader: 'devSiteCodeblock',
            options: {
              resolveExtensions: compiler.options.resolve.extensions,
            },
          },
        ],
      }, {
        resourceQuery: /dev-site-example/,
        use: [
          babelLoader,
          'devSiteExample',
        ],
      }, {
        test: /\.json$/,
        // this bypasses the default json loader
        type: 'javascript/auto',
        resourceQuery: /dev-site-package/,
        use: [
          babelLoader,
          'devSitePackage',
        ],
      }, {
        resourceQuery: /dev-site-props-table/,
        use: [
          babelLoader,
          {
            loader: 'devSitePropsTable',
            options: {
              mdx: mdxOptions(compiler.options.output.publicPath),
              resolveExtensions: compiler.options.resolve.extensions,
            },
          },
        ],
      },
      // Spread the original loaders. These will be applied if all above loaders fail.
      ...compiler.options.module.rules,
      ],
    }];

    // OUTPUT
    // compiler.options.output.publicPath = publicPath;

    // RESOLVE
    const devSiteConfigPath = path.resolve(path.join(processPath, 'dev-site-config'));
    compiler.options.resolve.modules.unshift(devSiteConfigPath);
    console.log('alias', compiler.options.resolve.alias);
    compiler.options.resolve.alias = { devSiteConfig: path.join(processPath, 'src', 'templates', 'devSiteConfig.template') };
    if (!compiler.options.resolve.plugins) {
      compiler.options.resolve.plugins = [];
    }
    compiler.options.resolve.plugins.push(
      new DirectorySwitcherPlugin({
        shouldSwitch: compiler.options.mode !== 'production',
        rootDirectories: [
          processPath,
        ],
      }),
    );

    compiler.options.resolve.plugins.push(
      new LocalPackageAliasPlugin({
        rootDirectories: [
          processPath,
        ],
      }),
    );

    // RESOLVE LOADER
    // add the path to search for dev site loaders
    compiler.options.resolveLoader.modules = [
      path.resolve(__dirname, '..', 'loaders'),
      'node_modules',
    ];

    // generate the 404 page.
    new HtmlWebpackPlugin({
      filename: '404.html',
      template: path.join(__dirname, '..', '..', 'lib', '404.html'),
      inject: 'head',
      chunks: ['redirect'],
    }).apply(compiler);

    // WEBPACK DEV SERVER
    if (compiler.options.devServer) {
      compiler.options.devServer.historyApiFallback = true;
    }

    new DefinePlugin({
      // Base name is used to namespace terra-dev-site this is used in redirect.js which is only used in the 404 page.
      TERRA_DEV_SITE_BASENAME: JSON.stringify(basename),
    }).apply(compiler);
  }

  apply(compiler) {
    // Use default public path else the env else /
    let defaultPublicPath;
    if (compiler.options.output && compiler.options.output.publicPath) {
      defaultPublicPath = compiler.options.output.publicPath;
    }
    const publicPath = defaultPublicPath || process.env.TERRA_DEV_SITE_PUBLIC_PATH || '/';

    compiler.options.output.publicPath = publicPath;

    // Strip the trailing / from the public path.
    const basename = publicPath.slice(0, -1);

    SitePlugin.applyOneTimeSetup(compiler);
    // Load the site configuration.

    compiler.options.entry = {
      ...compiler.options.entry,
      ...this.entry,
    };

    const otherApps = Object.values(siteRegistry).filter(app => app.path !== this.config.prefix);

    // MODULE
    // ADD config loader
    compiler.options.module.rules = [
      {
        // resourceQuery: \terra-dev-site-config\new RegExp(site.configFileName),
        test: /\.dev-site-config-template$/,
        resourceQuery: /terra-dev-site-config/,
        use: [
          babelLoader,
          {
            loader: 'devSiteConfig',
            options: {
              siteConfig: this.config,
              mode: compiler.options.mode,
              prefix: this.config.prefix,
              apps: otherApps,
              basename,
              resolveExtensions: compiler.options.resolve.extensions,
            },
          },
        ],
      },
      ...compiler.options.module.rules,
    ];

    new HtmlWebpackPlugin({
      title: this.config.titleConfig.title,
      direction: this.config.defaultDirection,
      filename: this.htmlFileName,
      template: path.join(__dirname, '..', '..', 'lib', 'index.html'),
      rootElementId: 'root',
      favicon: this.config.favicon,
      headHtml: [getNewRelicJS()].concat(this.config.headHtml),
      headChunks: ['rewriteHistory'],
      excludeChunks: ['redirect', ...Object.values(otherApps).map(app => app.entry)],
      inject: false, // This turns off auto injection. We handle this ourselves in the template.
    }).apply(compiler);
  }
}

module.exports = SitePlugin;
