/* eslint-disable no-param-reassign */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { DefinePlugin } = require('webpack');
const fs = require('fs');

const DirectorySwitcherPlugin = require('./resolve/DirectorySwitcherPlugin');
const LocalPackageAliasPlugin = require('./resolve/LocalPackageAliasPlugin');
const { babelLoader, getMdxLoader } = require('./siteLoaderUtils');
const getNewRelicJS = require('../new-relic/getNewRelicJS');

// Singletons
let oneTimeSetupComplete = false;
const siteRegistry = {};
const processPath = process.cwd();
const isLernaMonoRepo = fs.existsSync(path.join(processPath, 'lerna.json'));

/**
 * Updates the webpack options with defaults that terra-dev-site requires.
 */
class SitePlugin {
  constructor({
    entry,
    config,
    contentDirectory,
  }) {
    // Apply defaults to the config.
    this.siteConfig = config;
    this.contentDirectory = contentDirectory;
    const { pathPrefix, titleConfig } = this.siteConfig;
    this.entry = entry;

    if (pathPrefix) {
      this.entryKey = `${pathPrefix}/index`;
      this.resourceQuery = `?${pathPrefix}-terra-entry`;
      this.htmlFileName = `${pathPrefix}/index.html`;
      this.url = `/${pathPrefix}/`;
    } else {
      this.entryKey = 'index';
      this.resourceQuery = '?terra-entry';
      this.htmlFileName = 'index.html';
      this.url = '/';
    }

    if (siteRegistry[pathPrefix]) {
      throw Error('The PathPrefix must be unique per TerraDevSite Plugin');
    }
    // Register each application instance with the siteRegistry
    siteRegistry[pathPrefix] = {
      path: pathPrefix,
      url: this.url,
      title: titleConfig.title,
      entry: this.entryKey,
    };
  }

  static applyOneTimeSetup({
    compiler,
    sourceFolder,
    distributionFolder,
    basename,
    isWebpack5,
  }) {
    if (oneTimeSetupComplete) {
      return;
    }
    oneTimeSetupComplete = true;
    const mdxLoader = getMdxLoader(compiler.options.output.publicPath);

    // If a mono repo, update the rootDirectories to include all the packages.
    const rootDirectories = [
      ...isLernaMonoRepo ? [path.resolve(processPath, 'packages', '*')] : [processPath],
    ];

    let webpackConfig = {
      entry: {
        rewriteHistory: '@cerner/terra-dev-site/lib/browser-router-redirect/rewriteHistory',
        redirect: '@cerner/terra-dev-site/lib/browser-router-redirect/redirect',
      },
      module: {
        rules: [{
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
                  /entry\.template$/,
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
            resourceQuery: '?dev-site-codeblock',
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
            resourceQuery: '?dev-site-example',
            use: [
              babelLoader,
              'devSiteExample',
            ],
          }, {
            test: /\.json$/,
            // this bypasses the default json loader
            type: 'javascript/auto',
            resourceQuery: '?dev-site-package',
            use: [
              babelLoader,
              'devSitePackage',
            ],
          }, {
            resourceQuery: '?dev-site-props-table',
            use: [
              babelLoader,
              mdxLoader,
              {
                loader: 'devSitePropsTable',
                options: {
                  resolveExtensions: compiler.options.resolve.extensions,
                },
              },
            ],
          },
          ],
        }],
      },
      resolve: {
        plugins: [
          ...compiler.options.mode !== 'production' && sourceFolder !== distributionFolder
            ? [
              // Switch between source and distribution files.
              new DirectorySwitcherPlugin({
                source: sourceFolder,
                distribution: distributionFolder,
                rootDirectories,
              }),
            ]
            : [],
          // Alias the local package to allow imports to reference the file as if it was imported from node modules.
          new LocalPackageAliasPlugin({
            rootDirectories,
          }),
        ],
      },
      // add the path to search for dev site loaders
      resolveLoader: {
        modules: [
          path.resolve(__dirname, '..', 'loaders'),
          'node_modules',
        ],
      },
      devServer: {
        // Setting this to enable browser routing
        historyApiFallback: true,
      },
    };

    // If this plugin is used with webpack 5 we must normalize the webpack config.
    if (isWebpack5) {
      webpackConfig = compiler.webpack.config.getNormalizedWebpackOptions(webpackConfig);
    }

    // ENTRY
    compiler.options.entry = {
      ...compiler.options.entry,
      ...webpackConfig.entry,
    };

    // MODULE
    webpackConfig.module.rules[0].oneOf = webpackConfig.module.rules[0].oneOf.concat(compiler.options.module.rules);
    compiler.options.module.rules = webpackConfig.module.rules;

    // RESOLVE
    compiler.options.resolve.plugins = (compiler.options.resolve.plugins || []).concat(webpackConfig.resolve.plugins);

    // RESOLVE LOADER
    compiler.options.resolveLoader.modules = webpackConfig.resolveLoader.modules;

    // generate the 404 page.
    new HtmlWebpackPlugin({
      filename: '404.html',
      template: path.join(__dirname, '..', 'templates', '404.html'),
      inject: 'head',
      chunks: ['redirect'],
    }).apply(compiler);

    // WEBPACK DEV SERVER
    if (compiler.options.devServer) {
      // Setting this to enable browser routing
      compiler.options.devServer.historyApiFallback = webpackConfig.devServer.historyApiFallback;
    }

    new DefinePlugin({
      // Base name is used to namespace terra-dev-site this is used in redirect.js which is only used in the 404 page.
      TERRA_DEV_SITE_BASENAME: JSON.stringify(basename),
    }).apply(compiler);
  }

  apply(compiler) {
    const isWebpack5 = compiler.webpack && compiler.webpack.version.startsWith('5');

    // Use default public path else the env else /
    let defaultPublicPath;
    if (compiler.options.output && compiler.options.output.publicPath) {
      defaultPublicPath = compiler.options.output.publicPath;
    }
    const publicPath = process.env.TERRA_DEV_SITE_PUBLIC_PATH || defaultPublicPath || '/';

    // OUTPUT
    compiler.options.output.publicPath = publicPath;

    // Strip the trailing / from the public path.
    let basename = publicPath.slice(0, -1);

    const { sourceFolder, distributionFolder } = this.siteConfig;

    // Since there can be multiple dev site plugins this config we only want to do once for all of them.
    SitePlugin.applyOneTimeSetup({
      compiler,
      sourceFolder,
      distributionFolder,
      basename,
      isWebpack5,
    });

    // Get the list of apps excluding this current app.
    const filteredSites = Object.values(siteRegistry).filter(site => site.path !== this.siteConfig.pathPrefix);

    // Map to what we want to send to site config
    const otherSites = filteredSites.map((site) => ({
      path: site.path,
      title: site.title,
      url: `${basename}${site.url}`,
    }));

    // if there is a path prefix we want to update the react router basename to include the prefix.
    if (this.siteConfig.pathPrefix) {
      basename = [basename, this.siteConfig.pathPrefix].join('/');
    }

    let webpackConfig = {
      entry: {
        [this.entryKey]: `@cerner/terra-dev-site/lib/webpack/templates/entry.template${this.resourceQuery}`,
      },
      module: {
        rules: [
          {
            // This loader generates the entrypoint and sets up the config template path and resource query.
            resourceQuery: this.resourceQuery,
            use: [
              babelLoader,
              {
                loader: 'devSiteEntry',
                options: {
                  entryPath: this.entry,
                  siteConfig: this.siteConfig,
                  sites: otherSites,
                  basename,
                  resolveExtensions: compiler.options.resolve.extensions,
                  isLernaMonoRepo,
                  contentDirectory: this.contentDirectory,
                },
              },
            ],
          },
        ],
      },
    };

    // If this plugin is used with webpack 5 we must normalize the webpack config.
    if (isWebpack5) {
      webpackConfig = compiler.webpack.config.getNormalizedWebpackOptions(webpackConfig);
    }

    // ENTRY
    compiler.options.entry = {
      ...compiler.options.entry,
      ...webpackConfig.entry,
    };

    // MODULE
    // we know there is a oneOf here because we just added it.
    compiler.options.module.rules[0].oneOf.unshift(webpackConfig.module.rules[0]);

    // Generate the index.html file for the site.
    new HtmlWebpackPlugin({
      title: this.siteConfig.titleConfig.title,
      filename: this.htmlFileName,
      template: path.join(__dirname, '..', 'templates', 'index.html'),
      favicon: this.siteConfig.faviconFilePath,
      headHtml: [getNewRelicJS()].concat(this.siteConfig.headHtml),
      excludeChunks: ['rewriteHistory', 'redirect', ...Object.values(filteredSites).map(site => site.entry)],
    }).apply(compiler);
  }
}

module.exports = SitePlugin;
