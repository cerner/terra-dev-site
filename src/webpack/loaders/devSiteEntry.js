const lodashTemplate = require('lodash.template');
const { getOptions } = require('loader-utils');

const generateNavigationConfig = require('../loaderUtils/generateNavigationConfig');

/**
 * Generate the example with the supplied file.
 * Don't use an arrow function
 */
const loader = async function loader(template) {
  const callback = this.async();

  const imports = {};
  let index = 0;

  const addImport = (path) => {
    let ident = imports[path];
    if (ident) {
      return ident;
    }
    ident = `import${index}`;
    index += 1;
    imports[path] = ident;
    return ident;
  };

  const {
    entryPath,
    siteConfig,
    basename,
    resolveExtensions,
    sites,
    contentDirectory,
    isLernaMonoRepo,
  } = getOptions(this);

  const extensionItems = (siteConfig.extensionItems || []).map((ext) => ({
    key: ext.key,
    text: ext.text,
    icon: addImport(ext.iconPath),
    modal: addImport(ext.modalFilePath),
  }));

  const {
    contentImports,
    navigationConfig,
    routesMap,
    pageConfig,
  } = generateNavigationConfig({
    siteConfig,
    resolveExtensions,
    mode: this.mode,
    verbose: false,
    contentDirectory,
    isLernaMonoRepo,
    addContextDependency: this.addContextDependency,
    // getLogger is undefined in the loader runner for tests, but never in acutal usage.
    logger: this.getLogger ? this.getLogger('terra-dev-site loader') : undefined,
  });

  return callback(null, lodashTemplate(template)({
    entryPath,
    title: siteConfig.titleConfig.title,
    headline: siteConfig.titleConfig.headline,
    subline: siteConfig.titleConfig.subline,
    defaultTheme: siteConfig.defaultTheme,
    defaultLocale: siteConfig.defaultLocale,
    defaultDirection: siteConfig.defaultDirection,
    basename,
    contentImports,
    navigationConfig: JSON.stringify(navigationConfig),
    routesMap: JSON.stringify(routesMap),
    pageConfig: JSON.stringify(pageConfig),
    extensionItems,
    imports,
    sites: JSON.stringify(sites),
    sideEffectImportFilePaths: siteConfig.sideEffectImportFilePaths,
    enableDebugLogging: siteConfig.enableDebugLogging,
  }));
};

module.exports = loader;
