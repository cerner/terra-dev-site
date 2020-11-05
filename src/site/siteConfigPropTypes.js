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

const pageContentConfigPropType = PropTypes.shape({
  path: PropTypes.string,
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
});

const navigationConfigPropType = PropTypes.arrayOf(PropTypes.shape({
  text: PropTypes.string.isRequired,
  pageConfig: pageContentConfigPropType,
  children: PropTypes.array,
}));

const contentImportsPropType = PropTypes.object;
const pageConfigPropType = PropTypes.object;
const routesMapPropType = PropTypes.object;

/**
 * Object describing the generated dev-site-config object.
 */
const siteConfigPropType = PropTypes.shape({
  basename: PropTypes.string.isRequired,
  contentImports: contentImportsPropType.isRequired,
  /**
   * Custom extensions
   */
  extensionItems: extensionItemsPropType.isRequired,
  navigationConfig: navigationConfigPropType,
  pageConfig: pageConfigPropType.isRequired,
  routesMap: routesMapPropType.isRequirede,
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
  titleConfig: PropTypes.shape({
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
  }).isRequired,
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
};
