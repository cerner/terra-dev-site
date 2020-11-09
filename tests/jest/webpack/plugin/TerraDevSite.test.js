const mockSitePlugin = { apply: jest.fn() };
jest.mock('../../../../src/webpack/plugin/applyDefaults');
jest.mock('../../../../src/webpack/plugin/SitePlugin', () => (
  // Works and lets you check for constructor calls:
  jest.fn().mockImplementation(() => (
    mockSitePlugin
  ))
));
// eslint-disable-next-line no-unused-vars
jest.mock('webpack', () => ({ DefinePlugin: jest.fn(() => ({ apply: _compiler => ({}) })) }));
// const webpack = require('webpack');
// const loadSiteConfig = require('../../../../../scripts/generate-app-config/loadSiteConfig');
// const GeneratePlugin = require('../../../../../config/webpack/plugin/GeneratePlugin');
// const SetupPlugin = require('../../../../../config/webpack/plugin/SetupPlugin');
const TerraDevSite = require('../../../../src/webpack/plugin/TerraDevSite');

const applyDefaults = require('../../../../src/webpack/plugin/applyDefaults');
const SitePlugin = require('../../../../src/webpack/plugin/SitePlugin');

describe('TerraDevSitePlugin', () => {
  it('sets up site plugin', () => {
    const config = {
      config: true,
    };
    const plug = new TerraDevSite(config);
    expect(SitePlugin).toHaveBeenCalledWith({
      config,
      applyDefaults,
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

// describe('TerraDevSiteGeneratePlugin', () => {
//   it('sets up member variables', () => {
//     loadSiteConfig.mockReturnValue({ config: 'config', appConfig: { defaultLocale: 'en' } });
//     const plug = new TerraDevSite({
//       env: {
//         defaultLocale: 'lang',
//       },
//       sites: [{
//         siteConfig: { herp: 'derp', appConfig: { defaultLocale: 'en' } },
//         prefix: 'prefix',
//         indexPath: 'place',
//       }],
//     });
//     expect(loadSiteConfig).toHaveBeenCalledWith('site.config.js', path.join(process.cwd(), 'config', 'site', 'site.config.js'));
//     expect(plug.sites).toEqual([
//       {
//         configFileName: 'site.config.js',
//         defaultConfigPath: path.join(process.cwd(), 'config', 'site', 'site.config.js'),
//         siteConfig: { config: 'config', appConfig: { defaultLocale: 'lang' } },
//         indexPath: path.join(process.cwd(), 'lib', 'TerraDevSite'),
//       },
//       {
//         siteConfig: { herp: 'derp', appConfig: { defaultLocale: 'lang' } },
//         prefix: 'prefix',
//         indexPath: 'place',
//       },
//     ]);
//   });
//   it('applies the plugin', () => {
//     loadSiteConfig.mockReturnValue({ config: 'config', appConfig: { defaultLocale: 'en' } });
//     const plug = new TerraDevSite({
//       sites: [{
//         siteConfig: { herp: 'derp', appConfig: { defaultLocale: 'en' } },
//         prefix: 'prefix',
//         indexPath: 'place',
//       }],
//     });
//     const compiler = {
//       options: {},
//     };
//     plug.apply(compiler);
//     expect(GeneratePlugin).toHaveBeenCalledWith({
//       sites: [
//         {
//           configFileName: 'site.config.js',
//           defaultConfigPath: path.join(process.cwd(), 'config', 'site', 'site.config.js'),
//           siteConfig: { config: 'config', appConfig: { defaultLocale: 'en' } },
//           indexPath: path.join(process.cwd(), 'lib', 'TerraDevSite'),
//         },
//         {
//           siteConfig: { herp: 'derp', appConfig: { defaultLocale: 'en' } },
//           prefix: 'prefix',
//           indexPath: 'place',
//         },
//       ],
//       basename: '',
//     });
//     expect(SetupPlugin).toHaveBeenCalledWith({
//       publicPath: '/',
//     });
//     expect(webpack.DefinePlugin).toHaveBeenCalledWith({
//       TERRA_DEV_SITE_BASENAME: JSON.stringify(''),
//     });
//   });
// });
