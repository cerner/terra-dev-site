/* eslint-disable no-param-reassign */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const generateAppConfig = require('../../../scripts/generate-app-config/generateAppConfig');
const getNewRelicJS = require('../../../scripts/new-relic/getNewRelicJS');

/**
 * Generate the html file
 * @param {*} object
 * filename - name for the generated html file
 * lang - language for the page
 * siteConfig - config for the page
 * siteEntries - all entries
 * entry - this entry
 */
const addHtmlPlugin = ({
  filename, siteConfig, otherSiteEntries,
}) => (
  new HtmlWebpackPlugin({
    title: siteConfig.appConfig.title,
    direction: siteConfig.appConfig.defaultDirection,
    filename,
    template: path.join(__dirname, '..', '..', '..', 'lib', 'index.html'),
    rootElementId: 'root',
    favicon: siteConfig.appConfig.favicon,
    headHtml: [getNewRelicJS()].concat(siteConfig.appConfig.headHtml),
    headChunks: ['rewriteHistory'],
    excludeChunks: ['redirect', ...otherSiteEntries],
    inject: false, // This turns off auto injection. We handle this ourselves in the template.
  })
);

/**
 * Generate the prefixed entry name
 * @param {*} site
 */
const prefixEntry = site => (site.prefix ? `${site.prefix}/${'index'}` : 'index');

/**
 * Generate app title based on the app config.
 * @param {*} site
 */
const appTitle = (site) => {
  const { headline, title, subline } = site.siteConfig.appConfig;

  return [headline, title, subline].filter(item => item).join(' - ');
};

/**
 * Generate the config files needed for the sites passed in.
 */
class GeneratePlugin {
  constructor({
    sites, basename = '',
  } = {}) {
    this.entries = [];
    this.apps = [];
    this.sites = sites.map((site) => {
      const entry = prefixEntry(site);
      this.entries.push(entry);

      let filename = 'index.html';
      let siteBasename = basename;

      // update filename and basename with the prefix for the site
      if (site.prefix) {
        filename = `${site.prefix}/index.html`;
        siteBasename = `${basename}/${site.prefix}`;
      }

      // list of all apps to switch to
      this.apps.push({
        path: site.prefix,
        url: siteBasename || '/',
        title: appTitle(site),
      });
      return ({
        ...site,
        // name of webpack entry to be added
        entry,
        // name of html file to be generated
        filename,
        // basename for react router
        basename: siteBasename,
      });
    });
  }

  apply(compiler) {
    this.sites.forEach((site) => {
      const {
        siteConfig, prefix, basename, filename, entry, indexPath,
      } = site;

      // Add the entry to options, entry should already be valued.
      compiler.options.entry[entry] = indexPath;

      // Generate the files need to spin up the site.
      generateAppConfig({
        siteConfig,
        mode: compiler.options.mode,
        prefix,
        apps: this.apps.filter(app => app.path !== prefix),
        basename,
        resolveExtensions: compiler.options.resolve.extensions,
      });

      // generate index html files
      addHtmlPlugin({
        filename,
        siteConfig,
        otherSiteEntries: this.entries.filter(indexEntry => indexEntry !== entry),
      }).apply(compiler);
    });
  }
}

module.exports = GeneratePlugin;
