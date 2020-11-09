const DirectorySwitcherPlugin = require('../../../../src/webpack/plugin/TerraDevSiteEntrypoints');

describe('DirectorySwitcherPlugin', () => {
  it('returns expected entries', () => {
    expect(DirectorySwitcherPlugin).toEqual({
      rewriteHistory: '@cerner/terra-dev-site/lib/browser-router-redirect/rewriteHistory',
      redirect: '@cerner/terra-dev-site/lib/browser-router-redirect/redirect',
    });
  });
});
