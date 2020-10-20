/* eslint-disable no-param-reassign */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

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
const htmlPlugin = ({
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

const meta = ({
  sites, basename = '',
}) => {
  const entries = [];
  const apps = [];
  const devSites = sites.map((site) => {
    const entry = prefixEntry(site);
    entries.push(entry);

    let filename = 'index.html';
    let siteBasename = basename;

    // update filename and basename with the prefix for the site
    if (site.prefix) {
      filename = `${site.prefix}/index.html`;
      siteBasename = `${basename}/${site.prefix}`;
    }

    // list of all apps to switch to
    apps.push({
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
  return { entries, devSites, apps };
};

/**
 * Generate the config files needed for the sites passed in.
 */
const getConfig = ({
  devSites, entries, apps, mode, resolveExtensions, babelLoader,
}) => {
  const config = {
    entry: {},
    rules: [],
    plugins: [],
  };

  devSites.forEach((site) => {
    const {
      siteConfig, prefix, basename, filename, entry, indexPath,
    } = site;

    // Add the entry to options, entry should already be valued.
    config.entry[entry] = indexPath;

    config.rules.push(
      {
        test: /devSiteConfig.template$/,
        use: [
          babelLoader,
          {
            loader: 'devSiteConfig',
            options: {
              siteConfig,
              mode,
              prefix,
              apps,
              basename,
              resolveExtensions,
            },
          },
        ],
      },
    );

    // generate index html files
    config.plugins.push(htmlPlugin({
      filename,
      siteConfig,
      otherSiteEntries: entries.filter(indexEntry => indexEntry !== entry),
    }));
  });

  return config;
};

module.exports = {
  meta,
  getConfig,
};
