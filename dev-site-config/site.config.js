
const siteConfig = {
  /* The navigation configuration.  */
  navConfig: './navigation.config',

  /* The path to the component configuration. */
  componentConfig: 'componentConfig',

  /* The README content to display on the home page. */
  readMeContent: '../README.md',

  appConfig: {
    /* The title the site header should display. */
    title: 'Terra Dev Site',
    locales: ['en'],
    bidirectional: false,
    extensions: {
      gitHubUrl: 'https://github.com/cerner/terra-dev-site',
    },
  },
};

module.exports = siteConfig;
