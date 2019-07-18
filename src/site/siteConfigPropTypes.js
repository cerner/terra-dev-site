
import PropTypes from 'prop-types';

const settingsConfigPropType = PropTypes.shape({
  defaultTheme: PropTypes.string,
  themes: PropTypes.object,
  defaultLocale: PropTypes.string,
  locales: PropTypes.arrayOf(PropTypes.string),
  defaultDirection: PropTypes.string,
  directions: PropTypes.arrayOf(PropTypes.string),
});

const capabilitiesPropType = PropTypes.object;

const siteConfigPropType = PropTypes.shape({
  nameConfig: PropTypes.shape({
    title: PropTypes.string,
    accessory: PropTypes.element,
  }),
  settingsConfig: settingsConfigPropType,
  menuItems: PropTypes.object,
  contentConfig: PropTypes.object,
  navigationItems: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    text: PropTypes.string,
  })),
  indexPath: PropTypes.string,
  apps: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    title: PropTypes.string,
    file: PropTypes.string,
    basename: PropTypes.string,
    rootElementId: PropTypes.string,
  })),
  capabilities: capabilitiesPropType,
  extensions: PropTypes.arrayOf(PropTypes.object),
  placeholderSrc: PropTypes.string,
});

export default siteConfigPropType;
export {
  settingsConfigPropType,
  capabilitiesPropType,
};
