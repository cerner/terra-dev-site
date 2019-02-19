const ImportAggregator = require('./generation-objects/ImportAggregator');
const IdentifierPlaceholder = require('./generation-objects/IdentifierPlaceholder');

/**
* Generates the file representing extensions.
*/
const generateExtensions = (appConfig) => {
  const imports = new ImportAggregator();

  if (appConfig.extensions) {
    const { gitHubUrl } = appConfig.extensions;

    if (gitHubUrl) {
      imports.addImport('react', 'React');
      imports.addImport('terra-dev-site/lib/wrappers/_GitHubLinkExtension', 'GitHubLinkExtension');
      imports.addImport('terra-dev-site/lib/wrappers/_ExtensionsWrapper', 'ExtensionsWrapper');
      return {
        // This places JSX inline for the component variable.
        config: new IdentifierPlaceholder(`(
          <ExtensionsWrapper>
            <GitHubLinkExtension href="${gitHubUrl}" />
          </ExtensionsWrapper>
          )`),
        imports,
      };
    }
  }

  return undefined;
};

module.exports = generateExtensions;
