const navConfig = require('./navigation.config');

const siteConfig = {
  navConfig,

  appConfig: {
    locales: ['en'],
    bidirectional: false,
  },

  includeTestEvidence: false,

  filterSideMenu: true,
};

module.exports = siteConfig;
