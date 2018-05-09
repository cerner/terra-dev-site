const navConfig = require('./navigation.config');

const siteConfig = {
  /* The navigation configuration.  */
  navConfig,

  appConfig: {
    /* The title the site header should display. */
    locales: ['en'],
    bidirectional: false,
    extensions: {
      gitHubUrl: 'https://github.com/cerner/terra-dev-site',
    },
  },
};

module.exports = siteConfig;
