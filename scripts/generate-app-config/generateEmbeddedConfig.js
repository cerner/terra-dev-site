const ImportAggregator = require('./generation-objects/ImportAggregator');
const IdentifierPlaceholder = require('./generation-objects/IdentifierPlaceholder');

/**
* Generates the file representing embedded configuration.
*/
const generateEmbeddedConfig = (embeddedConfig) => {
  const imports = new ImportAggregator();
  const { providerInit, consumerInit, ...embeddedTestsConfig } = embeddedConfig;
  const config = { Provider: {}, Consumer: {}, ...embeddedTestsConfig };
  const xfcImports = [];

  if (consumerInit) {
    imports.addImport(ImportAggregator.relativePath(consumerInit), 'CustomConsumer');
    config.Consumer.init = new IdentifierPlaceholder('() => CustomConsumer()');
  } else {
    xfcImports.push('Consumer');
    config.Consumer.init = new IdentifierPlaceholder('() => Consumer.init()');
  }

  if (providerInit) {
    imports.addImport(ImportAggregator.relativePath(providerInit), ' CustomProvider');
    config.Provider.init = new IdentifierPlaceholder('() => CustomProvider()');
  } else {
    xfcImports.push('Provider');
    config.Provider.init = new IdentifierPlaceholder('() => Provider.init({ acls: ["*"], secret: () => (Promise.resolve("Success")), })');
  }

  if (xfcImports.length) {
    imports.addImport('xfc', `{ ${xfcImports.join(', ')} }`);
  }

  return {
    config,
    imports,
  };
};

module.exports = generateEmbeddedConfig;
