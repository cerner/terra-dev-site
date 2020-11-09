
// eslint-disable-next-line no-unused-vars
jest.mock('webpack', () => ({ DefinePlugin: jest.fn(() => ({ apply: _compiler => ({}) })) }));
const path = require('path');
const webpack = require('webpack');
const SitePlugin = require('../../../../src/webpack/plugin/SitePlugin');

describe('SitePlugin', () => {
  it('sets up site plugin', () => {
    const applyDefaults = jest.fn();
    const siteConfig = {
      config: {},
      applyDefaults,
      entry: path.resolve(__dirname, '..', '..', '..', '..', 'lib', 'site', 'Site'),
      contentDirectory: 'terra-dev-site',
    };
    const plug = new SitePlugin(siteConfig);
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
