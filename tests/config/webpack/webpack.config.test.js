const webpackConfig = require('../../../config/webpack/webpack.config');

const configExpectations = processPath => ({
  entry: expect.objectContaining({
    rewriteHistory: `${processPath}/lib/rewriteHistory`,
    redirect: `${processPath}/lib/redirect`,
  }),
});

describe('webpack config', () => {
  it('generates wepack config for dev', () => {
    const config = webpackConfig();
    const processPath = process.cwd();
    expect(config).toEqual(expect.objectContaining(configExpectations(processPath)));
    expect(config.plugins.slice(-1)[0].constructor.name).toBe('TerraDevSite');
    expect(config.resolve.plugins.slice(-2)[0].constructor.name).toBe('DirectorySwitcherPlugin');
    expect(config.resolve.plugins.slice(-1)[0].constructor.name).toBe('LocalPackageAliasPlugin');
  });
});
