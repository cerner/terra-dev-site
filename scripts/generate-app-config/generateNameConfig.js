const startCase = require('lodash.startcase');
const ImportAggregator = require('./generation-objects/ImportAggregator');

/**
* Generates the file representing app name configuration.
*/
const generateNameConfig = (appConfig) => {
  const imports = new ImportAggregator();
  const config = {
    title: startCase(appConfig.title),
  };

  // If we have an image, inject it into a terra-image.
  if (appConfig.logoSrc) {
    imports.addImport('react', 'React');
    const imageName = 'logo';
    imports.addImport(appConfig.logoSrc, imageName);
    config.accessory = imports.addImport(
      'terra-image',
      'Image',
      `(<Image variant="rounded" src={${imageName}} height="26px" width="26px" isFluid />)`,
    );
  }

  return { config, imports };
};

module.exports = generateNameConfig;
