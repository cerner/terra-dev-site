const mockSitePlugin = { apply: jest.fn() };
jest.mock('../../../../src/webpack/plugin/applyDefaults');
jest.mock('../../../../src/webpack/plugin/SitePlugin', () => (
  jest.fn().mockImplementation(() => (
    mockSitePlugin
  ))
));
const TerraDevSite = require('../../../../src/webpack/plugin/TerraDevSite');

const applyDefaults = require('../../../../src/webpack/plugin/applyDefaults');
const SitePlugin = require('../../../../src/webpack/plugin/SitePlugin');

describe('TerraDevSitePlugin', () => {
  it('sets up site plugin', () => {
    const returnedConfig = {
      configWithDefaults: true,
    };
    applyDefaults.mockReturnValue(returnedConfig);
    const config = {
      config: true,
    };
    const plug = new TerraDevSite(config);
    expect(SitePlugin).toHaveBeenCalledWith({
      config: returnedConfig,
      entry: '@cerner/terra-dev-site/lib/site',
      contentDirectory: 'terra-dev-site',
    });
    expect(SitePlugin).toHaveBeenCalledTimes(1);
    expect(plug.sitePlugin).toEqual(mockSitePlugin);
  });

  it('it calls apply on the site plugin', () => {
    const config = {
      config: true,
    };
    const plug = new TerraDevSite(config);
    const compiler = {
      options: {},
    };
    plug.apply(compiler);
    expect(plug.sitePlugin.apply).toHaveBeenCalledWith(compiler);
  });
});
