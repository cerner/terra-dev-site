// const path = require('path');
// const startCase = require('lodash.startcase');
// const findCssFileName = require('../loaderUtils/determineCssFileName');
const template = require('lodash.template');
const { getOptions } = require('loader-utils');

const generateNavigationConfig = require('../loaderUtils/generateNavigationConfig');

/**
 * Generate the example with the supplied file.
 * Don't use an arrow function
 */
const loader = async function loader(siteConfigTemplate) {
  const callback = this.async();

  const { siteConfig, resolveExtensions, basename } = getOptions(this);

  const {
    contentImports,
    navigationConfig,
    primaryNavPathToFirstPagePathMap,
    pageConfig,
  } = generateNavigationConfig(siteConfig, resolveExtensions, this.mode, false);

  return callback(null, template(siteConfigTemplate)({
    placeholderSrc: siteConfig.placeholderSrc,
    title: siteConfig.appConfig.title,
    headline: siteConfig.appConfig.headline,
    subline: siteConfig.appConfig.subline,
    defaultTheme: siteConfig.appConfig.defaultTheme,
    defaultLocale: siteConfig.appConfig.defaultLocale,
    defaultDirection: siteConfig.appConfig.defaultDirection,
    indexPath: siteConfig.navConfig.navigation.index,
    basename,
    contentImports,
    navigationConfig: JSON.stringify(navigationConfig),
    primaryNavPathToFirstPagePathMap: JSON.stringify(primaryNavPathToFirstPagePathMap),
    pageConfig: JSON.stringify(pageConfig),
  }));
};

module.exports = loader;
