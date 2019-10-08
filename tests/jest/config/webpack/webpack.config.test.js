const webpackConfig = require('../../../../config/webpack/webpack.config');

const configExpectations = processPath => ({
  entry: expect.objectContaining({
    rewriteHistory: `${processPath}/lib/rewriteHistory`,
    redirect: `${processPath}/lib/redirect`,
  }),
});

describe('webpack config', () => {
  it('generates webpack config for dev', () => {
    const config = webpackConfig();
    const processPath = process.cwd();
    expect(config).toEqual(expect.objectContaining(configExpectations(processPath)));
  });
});
