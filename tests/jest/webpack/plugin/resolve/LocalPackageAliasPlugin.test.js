const path = require('path');

const LocalPackageAliasPlugin = require('../../../../../src/webpack/plugin/resolve/LocalPackageAliasPlugin');

describe('LocalPackageAliasPlugin', () => {
  it('generates the alias structure', () => {
    const processPath = process.cwd();
    const plugin = new LocalPackageAliasPlugin({
      rootDirectories: [
        processPath,
        path.join(__dirname, 'packages', '*'),
      ],
    });

    expect(plugin.alias).toEqual([
      {
        name: '@cerner/terra-dev-site',
        onlyModule: false,
        alias: processPath,
      },
      {
        name: 'testPackage',
        onlyModule: false,
        alias: path.join(__dirname, 'packages', 'test'),
      },
    ]);
  });
});
