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
 * Callback for showing the side menu
 */
const capabilitiesPropType = PropTypes.object;

/**
 * Individual menu item for side nav
 */
const menuItemPropType = PropTypes.arrayOf(PropTypes.shape({
  /**
   * Text for the menu item
   */
  text: PropTypes.string,

  /**
   * On-click the menu item will take you here
   */
  path: PropTypes.string,

  /**
   * Sub menu items
   */
  childItems: PropTypes.arrayOf(PropTypes.object),
}));

/**
 * Menu items for side navigation
 */
const menuItemsPropType = PropTypes.PropTypes.objectOf(menuItemPropType);

/**
 * Object describing the generated dev-site-config object.
 */
const siteConfigPropType = PropTypes.shape({
  /**
   * Describes the site name
   */
  nameConfig: PropTypes.shape({
    /**
     * Title for site
     */
    title: PropTypes.string,
  }),
  /**
   * Object describing in site configurable settings
   */
  settingsConfig: settingsConfigPropType,
  /**
   * Menu items for side navigation
   */
  menuItems: menuItemsPropType,
  /**
   * Content items to be displayed in app.
   */
  contentConfig: PropTypes.object,
  /**
   * Primary navigation items.
   */
  navigationItems: PropTypes.arrayOf(PropTypes.shape({
    /**
     * Path to navigate to on click.
     */
    path: PropTypes.string,
    /**
     * Title text.
     */
    text: PropTypes.string,
  })),
  /**
   * / redirects here.
   */
  indexPath: PropTypes.string,
  /**
   * Unused for now.
   */
  apps: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    title: PropTypes.string,
    file: PropTypes.string,
    basename: PropTypes.string,
    rootElementId: PropTypes.string,
  })),
  /**
   * Describes capabilities of pages shown below various primary navigation items
   */
  capabilities: capabilitiesPropType,
  /**
   * Custom extensions
   */
  extensions: PropTypes.arrayOf(PropTypes.object),
  /**
   * Image to display on secondary nav pages where the first item is a folder.
   */
  placeholderSrc: PropTypes.string,
});

export default siteConfigPropType;
export {
  settingsConfigPropType,
  capabilitiesPropType,
  menuItemsPropType,
  menuItemPropType,
};
