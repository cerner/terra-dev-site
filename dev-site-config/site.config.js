const navConfig = require('./navigation.config');

const siteConfig = {
  navConfig,

  appConfig: {
    locales: ['en', 'es', 'en-US'],
    bidirectional: true,
  },

  includeTestEvidence: false,
};

module.exports = siteConfig;
