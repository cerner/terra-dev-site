const importSideEffects = require('../../../scripts/generate-app-config/importSideEffects');
const ImportAggregator = require('../../../scripts/generate-app-config/generation-objects/ImportAggregator');

describe('importSideEffects', () => {
  it('finds the correct side effect js files', () => {
    const sideEffects = [
      '../tests/scripts/generate-app-config/sideEffectFiles/normal',
      '../tests/scripts/generate-app-config/sideEffectFiles/jsx',
      '../tests/scripts/generate-app-config/sideEffectFiles/extension.js',
      `${process.cwd()}/tests/scripts/generate-app-config/sideEffectFiles/fullpath`,
      '../tests/scripts/generate-app-config/sideEffectFiles/*/*.js',
      '../tests/scripts/generate-app-config/sideEffectFiles/strangeExt.derp',
    ];
    const imports = new ImportAggregator();
    importSideEffects(sideEffects, imports);
    expect(imports.toCodeString()).toMatchSnapshot();
  });
});
