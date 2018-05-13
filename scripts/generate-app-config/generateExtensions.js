const ImportAggregator = require('./generation-objects/ImportAggregator');
const IdentifierPlaceholder = require('./generation-objects/IdentifierPlaceholder');

/**
* Generates the file representing extensions.
*/
const generateExtensions = (appConfig) => {
  const imports = new ImportAggregator();

  if (appConfig.extensions) {
    const gitHubUrl = appConfig.extensions.gitHubUrl;

    if (gitHubUrl) {
      imports.addImport('react', 'React');
      imports.addImport('terra-dev-site/lib/app/components/GitHubLinkExtension', 'GitHubLinkExtension');
      imports.addImport('terra-dev-site/lib/app/components/Extensions', 'Extensions');
      return {
        // This places JSX inline for the component variable.
        config: new IdentifierPlaceholder(
          `(
          <Extensions>
            <GitHubLinkExtension href="${gitHubUrl}" />
          </Extensions>
          )`,
        ),
        imports,
      };
    }
  }

  return undefined;
};

module.exports = generateExtensions;
