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
    const applyDefaults = jest.fn();
    const returnedConfig = {
      pathPrefix: 'pathPrefix',
      titleConfig: { title: 'titleConfig' },
      sourceFolder: 'src',
      distributionFolder: 'lib',
    };
    applyDefaults.mockReturnValue(returnedConfig);
    const config = {
      pathPrefix: 'pathPrefix',
    };
    const siteConfig = {
      config,
      entry: 'entry',
      applyDefaults,
      contentDirectory: 'terra-dev-site',
    };
    const plug = new SitePlugin(siteConfig);
    expect(applyDefaults).toHaveBeenCalledWith(config);
    expect(plug.siteConfig).toEqual(returnedConfig);
    expect(plug.entry).toEqual(siteConfig.entry);
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
    expect(HtmlWebpackPlugin).toHaveBeenNthCalledWith(1, {
      filename: '404.html',
      template: path.join(processPath, 'src', 'webpack', 'templates', '404.html'),
      inject: 'head',
      chunks: ['redirect'],
    });
    expect(HtmlWebpackPlugin).toHaveBeenNthCalledWith(2, {
      title: 'title',
      filename: 'prefix/index.html',
      template: path.join(process.cwd(), 'lib', 'index.html'),
      rootElementId: 'root',
      favicon: 'favicon',
      headHtml: [''],
      headChunks: ['rewriteHistory'],
      excludeChunks: ['redirect', 'index'],
      inject: false,
    });
  });

  it('sets up site plugin without Prefix', () => {
    const applyDefaults = jest.fn();
    const returnedConfig = {
      titleConfig: 'titleConfig',
    };
    applyDefaults.mockReturnValue(returnedConfig);
    const config = {
    };
    const siteConfig = {
      config,
      entry: 'entry',
      applyDefaults,
      contentDirectory: 'terra-dev-site',
    };
    const plug = new SitePlugin(siteConfig);
    expect(applyDefaults).toHaveBeenCalledWith(config);
    expect(plug.siteConfig).toEqual(returnedConfig);
    expect(plug.entry).toEqual(siteConfig.entry);
    expect(plug.contentDirectory).toEqual(siteConfig.contentDirectory);
    expect(plug.entryKey).toEqual('index');
    expect(plug.resourceQuery).toEqual('?terra-entry');
    expect(plug.htmlFileName).toEqual('index.html');
    expect(plug.url).toEqual('/');
  });

  // it('it calls apply on the site plugin', () => {
  //   const config = {
  //     config: true,
  //   };
  //   const plug = new TerraDevSite(config);
  //   const compiler = {
  //     options: {},
  //   };
  //   plug.apply(compiler);
  //   expect(plug.sitePlugin.apply).toHaveBeenCalledWith(compiler);
  // });
});
