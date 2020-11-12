import PropTypes from 'prop-types';

/**
 * Object describing in site configurable settings
 */
const settingsConfigPropType = PropTypes.shape({
  /**
   * By default the site is set to this theme
   */
  defaultTheme: PropTypes.string,

  /**
   * By default the site is set to this locale
   */
  defaultLocale: PropTypes.string,

  /**
   * By default the site is set to this direction
   */
  defaultDirection: PropTypes.string,
});

/**
 * Additional Sites that can be switched to.
 */
const sitesPropType = PropTypes.arrayOf(PropTypes.shape({
  /**
   * The path to the site
   */
  path: PropTypes.string,

  /**
   * The title of the site
   */
  title: PropTypes.string,

  /**
   * The url to navigate to the site
   */
  url: PropTypes.string,
}));

/**
 * Describes the extensions
 */
const extensionItemsPropType = PropTypes.arrayOf(PropTypes.shape({
  /**
   * The react key for the extension.
   */
  key: PropTypes.string,
  /**
   * The text describing the extension.
   */
  text: PropTypes.string,
  /**
   * The icon to represent the extension.
   */
  icon: PropTypes.elementType,
  /**
   * The modal to launch from the extension.
   */
  modal: PropTypes.elementType,
}));

/**
 * Describes page content
 */
const pageContentConfigPropType = PropTypes.shape({
  /**
   * The path to the page
   */
  path: PropTypes.string,
  /**
   * Text for the page
   */
  label: PropTypes.string.isRequired,
  /**
   * The type of the content being loaded
   */
  type: PropTypes.string.isRequired,
});

/**
 * Describes navigation config
 */
const navigationConfigPropType = PropTypes.arrayOf(PropTypes.shape({
  /**
   * The text for the nav item
   */
  label: PropTypes.string.isRequired,
  /**
   * The singular page config item
   */
  pageConfig: pageContentConfigPropType,
  /**
   * children
   */
  children: PropTypes.array,
}));

/**
 * Path to imports map
 */
const contentImportsPropType = PropTypes.object;
/**
 * Path to page config map
 */
const pageConfigPropType = PropTypes.object;
/**
 * Short routes to content routes.
 */
const routesMapPropType = PropTypes.object;

const titleConfigPropType = PropTypes.shape({
  /**
   * Title for site
   */
  title: PropTypes.string.isRequired,
  /**
   * Headline for site
   */
  subline: PropTypes.string,
  /**
   * subline for site
   */
  headline: PropTypes.string,
});

/**
 * Object describing the generated dev-site-config object.
 */
const siteConfigPropType = PropTypes.shape({
  /**
   * The basename for the application.
   */
  basename: PropTypes.string.isRequired,
  /**
   * The map of routes to lazy components.
   */
  contentImports: contentImportsPropType.isRequired,
  /**
   * Custom extensions
   */
  extensionItems: extensionItemsPropType.isRequired,
  /**
   * Configuration layout out primary and secondary navigation.
   */
  navigationConfig: navigationConfigPropType,
  /**
   * The map of routes to page config
   */
  pageConfig: pageConfigPropType.isRequired,
  /**
   * map of routes to redirect to content routes.
   */
  routesMap: routesMapPropType.isRequired,
  /**
   * Object describing in site configurable settings
   */
  settingsConfig: settingsConfigPropType.isRequired,
  /**
   * Sites to switch to
   */
  sites: sitesPropType.isRequired,
  /**
   * Describes the site name
   */
  titleConfig: titleConfigPropType.isRequired,
});

export default siteConfigPropType;
export {
  settingsConfigPropType,
  sitesPropType,
  routesMapPropType,
  pageConfigPropType,
  contentImportsPropType,
  navigationConfigPropType,
  pageContentConfigPropType,
  titleConfigPropType,
};
