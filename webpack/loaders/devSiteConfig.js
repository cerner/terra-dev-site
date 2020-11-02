const template = require('lodash.template');
const { getOptions } = require('loader-utils');

const generateNavigationConfig = require('../loaderUtils/generateNavigationConfig');

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

/**
 * Generate the example with the supplied file.
 * Don't use an arrow function
 */
const loader = async function loader(siteConfigTemplate) {
  const callback = this.async();

  // console.log('request', this.request);
  console.log('query', this.query);

  const {
    siteConfig,
    resolveExtensions,
    basename,
    apps,
    contentDirectory,
  } = getOptions(this);

  console.log('apps', JSON.stringify(apps));

  const extensionItems = (siteConfig.extensionItems || []).map((ext) => ({
    key: ext.key,
    text: ext.text,
    icon: addImport(ext.iconPath),
    modal: addImport(ext.modalPath),
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
  });

  // const contentImports = {};
  // const navigationConfig = [];
  // const routesMap = {};
  // const pageConfig = {};

  return callback(null, template(siteConfigTemplate)({
    title: siteConfig.titleConfig.title,
    headline: siteConfig.titleConfig.headline,
    subline: siteConfig.titleConfig.subline,
    defaultTheme: siteConfig.defaultTheme,
    defaultLocale: siteConfig.defaultLocale,
    defaultDirection: siteConfig.defaultDirection,
    indexPath: siteConfig.indexPath,
    basename,
    contentImports,
    navigationConfig: JSON.stringify(navigationConfig),
    routesMap: JSON.stringify(routesMap),
    pageConfig: JSON.stringify(pageConfig),
    extensionItems,
    imports,
    apps: JSON.stringify(apps),
    sideEffectImportFilePaths: siteConfig.sideEffectImportFilePaths,
  }));
};

module.exports = loader;

// module.exports.pitch = function pitch(remainingRequest, precedingRequest, data) {
//   // console.log('remainingRequest', remainingRequest);
//   // console.log('precedingRequest', precedingRequest);
//   // console.log('data', data);
//   // console.log('this.loaders', this.loaders);
// };
