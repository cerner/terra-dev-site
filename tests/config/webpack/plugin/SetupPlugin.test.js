jest.mock('html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const SetupPlugin = require('../../../../config/webpack/plugin/SetupPlugin');

const processPath = process.cwd();

describe('TerraDevSiteSetupPlugin', () => {
  it('applies the default setup', () => {
    const plug = new SetupPlugin({ publicPath: 'publicPath' });
    expect(plug.publicPath).toEqual('publicPath');
    const compiler = {
      options: {
        mode: 'dev',
        output: {
          publicPath: 'derp',
        },
        resolve: {
          modules: [],
        },
        devServer: {},
      },
    };
    plug.apply(compiler);
    expect(HtmlWebpackPlugin).toHaveBeenCalledWith({
      filename: '404.html',
      template: path.join(processPath, 'lib', '404.html'),
      inject: 'head',
      chunks: ['redirect'],
    });
    expect(compiler.options).toMatchObject({
      output: {
        publicPath: 'publicPath',
      },
      resolve: {
        modules: [path.join(processPath, 'dev-site-config')],
      },
      devServer: {
        historyApiFallback: true,
      },
    });
  });

  it('sets up the dev tool', () => {
    const plug = new SetupPlugin({ publicPath: 'publicPath' });
    const compiler = {
      options: {
        mode: 'production',
        output: {
          publicPath: 'derp',
        },
        resolve: {
          modules: [],
        },
      },
    };
    plug.apply(compiler);
    expect(compiler.options).toMatchObject({
      devtool: 'source-map',
    });
  });

  it('does not change a predefined devtool', () => {
    const plug = new SetupPlugin({ publicPath: 'publicPath' });
    const compiler = {
      options: {
        mode: 'production',
        output: {
          publicPath: 'derp',
        },
        resolve: {
          modules: [],
        },
        devtool: 'derp',
      },
    };
    plug.apply(compiler);
    expect(compiler.options).toMatchObject({
      devtool: 'derp',
    });
  });
});
