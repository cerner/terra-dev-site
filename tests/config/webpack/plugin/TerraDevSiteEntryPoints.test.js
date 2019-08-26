const path = require('path');

const DirectorySwitcherPlugin = require('../../../../config/webpack/plugin/TerraDevSiteEntryPoints');

describe('DirectorySwitcherPlugin', () => {
  it('returns expected entries', () => {
    expect(DirectorySwitcherPlugin).toEqual({
      rewriteHistory: path.resolve(path.join(__dirname, '..', '..', '..', '..', 'lib', 'rewriteHistory')),
      redirect: path.resolve(path.join(__dirname, '..', '..', '..', '..', 'lib', 'redirect')),
    });
  });
});
