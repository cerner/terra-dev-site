const startCase = require('lodash.startcase');
const ImportAggregator = require('./generation-objects/ImportAggregator');

const generateNameConfig = (appConfig) => {
  const imports = new ImportAggregator();
  const config = {
    title: startCase(appConfig.title),
  };

  if (appConfig.logoSrc) {
    imports.addImport('react', 'React');
    config.accessory = imports.addImport(
      'terra-image',
      'Image',
      `(<Image variant="rounded" src="${appConfig.logoSrc}" height="26px" width="26px" isFluid />)`,
    );
  }

  return { config, imports };
};

module.exports = generateNameConfig;
