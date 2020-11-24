const path = require('path');

const DirectorySwitcherPlugin = require('../../../../../src/webpack/plugin/resolve/DirectorySwitcherPlugin');

describe('DirectorySwitcherPlugin', () => {
  it('generates the dir structure', () => {
    const processPath = process.cwd();
    const plugin = new DirectorySwitcherPlugin({
      source: 'src',
      distribution: 'lib',
      rootDirectories: [
        processPath,
        path.join(__dirname, 'packages', '*'),
      ],
    });

    expect(plugin.dirs).toEqual([
      {
        distribution: path.join(process.cwd(), 'lib'),
        source: path.join(process.cwd(), 'src'),
      },
      {
        distribution: path.join(__dirname, 'packages', 'test', 'lib'),
        source: path.join(__dirname, 'packages', 'test', 'src'),
      },
    ]);
    expect(plugin.extensions).toEqual(['.js']);
  });
});
