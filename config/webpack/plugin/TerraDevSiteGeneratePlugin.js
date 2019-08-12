const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const generateAppConfig = require('../../../scripts/generate-app-config/generateAppConfig');
const getNewRelicJS = require('../../../scripts/new-relic/getNewRelicJS');

const indexPlugin = ({
  filename, lang, siteConfig, siteEntries, entry,
}) => {
  const otherSiteEntries = siteEntries.filter(indexEntry => indexEntry !== entry);
  return new HtmlWebpackPlugin({
    title: siteConfig.appConfig.title,
    filename,
    template: path.join(__dirname, '..', '..', '..', 'lib', 'index.html'),
    lang,
    rootElementId: 'root',
    dir: siteConfig.appConfig.defaultDirection,
    favicon: siteConfig.appConfig.favicon,
    headHtml: [getNewRelicJS()].concat(siteConfig.appConfig.headHtml),
    headChunks: ['rewriteHistory'],
    excludeChunks: ['redirect', ...otherSiteEntries],
    inject: false, // This turns off auto injection. We handle this ourselves in the template.
  });
};

const prefixEntry = site => (site.prefix ? `${site.prefix}/${'index'}` : 'index');
const appTitle = (site) => {
  const { headline, title, subline } = site.siteConfig.appConfig;

  return [headline, title, subline].filter(item => item).join(' - ');
};

class TerraDevSitePlugin {
  constructor({
    sites, lang, basename,
  } = {}) {
    this.entries = [];
    this.apps = [];
    this.sites = sites.map((site) => {
      const entry = prefixEntry(site);
      this.entries.push(entry);

      let filename = 'index.html';
      let siteBasename = basename;

      if (site.prefix) {
        filename = `${site.prefix}/index.html`;
        siteBasename = `${basename}/${site.prefix}`;
      }

      this.apps.push({
        path: site.prefix,
        url: siteBasename,
        title: appTitle(site),
      });
      return ({
        ...site,
        entry,
        filename,
        basename: siteBasename,
        lang: lang || site.siteConfig.appConfig.defaultLocale,
      });
    });
  }

  apply(compiler) {
    this.sites.forEach((site) => {
      const {
        siteConfig, prefix, basenameDefine, basename, filename, lang, entry,
      } = site;

      // GENERATE
      // Generate the files need to spin up the site.
      generateAppConfig({
        siteConfig,
        mode: compiler.options.mode,
        prefix,
        apps: this.apps.filter(app => app.path !== prefix),
      });

      new webpack.DefinePlugin({
        // Base name is used to namespace terra-dev-site
        [basenameDefine]: JSON.stringify(basename),
      }).apply(compiler);

      // indexes
      const indexEntryPoints = [];
      indexEntryPoints.push('terra-dev-site');
      // terra-dev-site index.html
      indexPlugin({
        filename,
        lang,
        siteConfig,
        siteEntries: this.entries,
        entry,
      }).apply(compiler);
    });
  }
}

module.exports = TerraDevSitePlugin;
