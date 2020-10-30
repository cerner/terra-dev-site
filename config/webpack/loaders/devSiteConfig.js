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

  const {
    siteConfig,
    resolveExtensions,
    basename,
    apps,
  } = getOptions(this);

  console.log('apps', JSON.stringify(apps));

  const extensions = (siteConfig.appConfig.extensions || []).map((ext) => ({
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
  } = generateNavigationConfig(siteConfig, resolveExtensions, this.mode, false);

  return callback(null, template(siteConfigTemplate)({
    title: siteConfig.appConfig.title,
    headline: siteConfig.appConfig.headline,
    subline: siteConfig.appConfig.subline,
    defaultTheme: siteConfig.appConfig.defaultTheme,
    defaultLocale: siteConfig.appConfig.defaultLocale,
    defaultDirection: siteConfig.appConfig.defaultDirection,
    indexPath: siteConfig.navigation.index,
    basename,
    contentImports,
    navigationConfig: JSON.stringify(navigationConfig),
    routesMap: JSON.stringify(routesMap),
    pageConfig: JSON.stringify(pageConfig),
    extensions,
    imports,
    apps: JSON.stringify(apps),
  }));
};

module.exports = loader;
