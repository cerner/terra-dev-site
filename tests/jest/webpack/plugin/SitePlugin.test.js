// eslint-disable-next-line no-unused-vars
jest.mock('webpack', () => ({ DefinePlugin: jest.fn(() => ({ apply: _compiler => ({}) })) }));
jest.mock('html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const SitePlugin = require('../../../../src/webpack/plugin/SitePlugin');

const processPath = process.cwd();

describe('SitePlugin', () => {
  it('sets up site plugin with Prefix', () => {
    const config = {
      pathPrefix: 'pathPrefix',
      titleConfig: { title: 'title' },
      sourceFolder: 'src',
      distributionFolder: 'lib',
      defaultDirection: 'rtl',
      faviconFilePath: 'favicon',
      headHtml: [],
    };
    const siteConfig = {
      config,
      entry: 'entry',
      contentDirectory: 'terra-dev-site',
    };
    const plug = new SitePlugin(siteConfig);
    expect(plug.entry).toEqual(siteConfig.entry);
    expect(plug.siteConfig).toEqual(config);
    expect(plug.contentDirectory).toEqual(siteConfig.contentDirectory);
    expect(plug.entryKey).toEqual('pathPrefix/index');
    expect(plug.resourceQuery).toEqual('?pathPrefix-terra-entry');
    expect(plug.htmlFileName).toEqual('pathPrefix/index.html');
    expect(plug.url).toEqual('/pathPrefix/');

    const compiler = {
      options: {
        output: {},
        module: {
          rules: [],
        },
        resolve: {},
        resolveLoader: {},
        devServer: {},
        entry: {},
      },
    };

    plug.apply(compiler);
    expect(compiler.options.output.publicPath).toEqual('/');

    expect(compiler.options.entry).toEqual({
      'pathPrefix/index': '@cerner/terra-dev-site/lib/webpack/templates/entry.template?pathPrefix-terra-entry',
      redirect: '@cerner/terra-dev-site/lib/browser-router-redirect/redirect',
      rewriteHistory: '@cerner/terra-dev-site/lib/browser-router-redirect/rewriteHistory',
    });

    expect(compiler.options.module.rules).toMatchSnapshot();

    expect(compiler.options.resolve.plugins).toEqual([{
      dirs: [{
        distribution: path.join(processPath, 'lib'),
        source: path.join(processPath, 'src'),
      }],
      extensions: ['.js'],
      shouldSwitch: true,
    }, {
      alias: [{
        alias: path.join(processPath),
        name: '@cerner/terra-dev-site',
        onlyModule: false,
      }],
    }]);

    expect(compiler.options.resolveLoader.modules).toEqual([
      path.resolve(process.cwd(), 'src', 'webpack', 'loaders'),
      'node_modules',
    ]);

    expect(compiler.options.devServer).toEqual({
      historyApiFallback: true,
    });

    expect(HtmlWebpackPlugin).toHaveBeenNthCalledWith(1, {
      filename: '404.html',
      template: path.join(processPath, 'src', 'webpack', 'templates', '404.html'),
      inject: 'head',
      chunks: ['redirect'],
    });
    expect(HtmlWebpackPlugin).toHaveBeenNthCalledWith(2, {
      title: 'title',
      filename: 'pathPrefix/index.html',
      template: path.join(process.cwd(), 'src', 'webpack', 'templates', 'index.html'),
      favicon: 'favicon',
      headHtml: [''],
      excludeChunks: ['rewriteHistory', 'redirect'],
    });
    expect(webpack.DefinePlugin).toHaveBeenCalledWith({
      TERRA_DEV_SITE_BASENAME: JSON.stringify(''),
    });
  });

  it('sets up site plugin without Prefix', () => {
    HtmlWebpackPlugin.mockReset();
    const config = {
      titleConfig: { title: 'title' },
      sourceFolder: 'src',
      distributionFolder: 'lib',
      defaultDirection: 'rtl',
      faviconFilePath: 'favicon',
      headHtml: [],
    };
    const siteConfig = {
      config,
      entry: 'entry',
      contentDirectory: 'terra-dev-site',
    };
    const plug = new SitePlugin(siteConfig);
    expect(plug.siteConfig).toEqual(config);
    expect(plug.entry).toEqual(siteConfig.entry);
    expect(plug.contentDirectory).toEqual(siteConfig.contentDirectory);
    expect(plug.entryKey).toEqual('index');
    expect(plug.resourceQuery).toEqual('?terra-entry');
    expect(plug.htmlFileName).toEqual('index.html');
    expect(plug.url).toEqual('/');

    const compiler = {
      options: {
        output: {},
        module: {
          rules: [
            {
              oneOf: [],
            },
          ],
        },
        resolve: {},
        resolveLoader: {},
        devServer: {},
        entry: {},
      },
    };

    plug.apply(compiler);
    expect(compiler.options.output.publicPath).toEqual('/');

    expect(compiler.options.entry).toEqual({
      index: '@cerner/terra-dev-site/lib/webpack/templates/entry.template?terra-entry',
    });

    expect(compiler.options.module.rules).toMatchSnapshot();

    expect(HtmlWebpackPlugin).toHaveBeenNthCalledWith(1, {
      title: 'title',
      filename: 'index.html',
      template: path.join(process.cwd(), 'src', 'webpack', 'templates', 'index.html'),
      favicon: 'favicon',
      headHtml: [''],
      excludeChunks: ['rewriteHistory', 'redirect', 'pathPrefix/index'],
    });
    // This is not called because one time setup has already been executed.
    expect(webpack.DefinePlugin).not.toHaveBeenCalled();
  });
});
