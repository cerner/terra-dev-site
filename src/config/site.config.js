const navigationConfig = require('./navigation.config');
const appConfig = require('./app.config');

module.exports = {
  /* The application configuration.  */
  appConfig,

  /* The component configuration. */
  componentConfig: {},

  /* The navigation configuration.  */
  navConfig: navigationConfig,
  /* The image to display as page placeholder when a component does not render. */
  placeholderSrc: '',

  /* The README content to display on the home page. */
  readMeContent: '',
};
