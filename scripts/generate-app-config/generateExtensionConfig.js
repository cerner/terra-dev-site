const ImportAggregator = require('./generation-objects/ImportAggregator');

/**
* Generates the file representing app name configuration.
*/
const generateExtensionConfig = (extensionConfig) => {
  const imports = new ImportAggregator();

  const config = extensionConfig.map(ext => (
    {
      icon: imports.addImport(ImportAggregator.relativePath(ext.iconPath)),
      key: ext.key,
      text: ext.text,
      component: imports.addReactLazyImport(ImportAggregator.relativePath(ext.componentPath)),
      size: ext.size,
    }
  ));

  return { config, imports };
};

module.exports = generateExtensionConfig;
