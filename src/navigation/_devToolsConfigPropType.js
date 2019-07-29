import PropTypes from 'prop-types';

/**
   * Config to setup the dev toolbar, when applicable.
   */
const devToolsConfig = PropTypes.shape({
  selectedTheme: PropTypes.string,
  selectedLocale: PropTypes.string,
  themes: PropTypes.arrayOf(PropTypes.string),
  locales: PropTypes.arrayOf(PropTypes.string),
  onChangeLocale: PropTypes.func,
  onChangeTheme: PropTypes.func,
});

export default devToolsConfig;
