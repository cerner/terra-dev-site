// const path = require('path');
// const startCase = require('lodash.startcase');
// const findCssFileName = require('../loaderUtils/determineCssFileName');
const template = require('lodash.template');
const { getOptions } = require('loader-utils');

/**
 * Generate the example with the supplied file.
 * Don't use an arrow function
 */
const loader = async function loader(siteConfigTemplate) {
  const callback = this.async();

  // console.log('this', this);

  const { siteConfig, basename } = getOptions(this);

  // console.log('options', getOptions(this));
  // console.log('loaders', this.loaders);

  this.emitFile('stuff.json', 'emittedFileContents');

  // console.log('loader options', options);

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
  }));
};

module.exports = loader;
