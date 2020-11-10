import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { ThemeContext } from 'terra-application/lib/theme';
import { withActiveBreakpoint } from 'terra-application/lib/breakpoints';
import { ApplicationLoadingOverlayProvider } from 'terra-application/lib/application-loading-overlay';
import { ApplicationStatusOverlayProvider } from 'terra-application/lib/application-status-overlay';
import ContentContainer from 'terra-content-container';

import ComponentToolbar from './_ComponentToolbar';
import CollapsingNavigationMenu from './_CollapsingNavigationMenu';

import styles from './SecondaryNavigationLayout.module.scss';

const cx = classNames.bind(styles);

let shouldFocusToggle = false;
let shouldFocusMenu = false;

const isCompactLayout = activeBreakpoint => activeBreakpoint === 'tiny' || activeBreakpoint === 'small';

const propTypes = {
  /**
   * Items to display for the menu
   */
  menuItems: PropTypes.PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    path: PropTypes.string,
  })).isRequired,

  /**
   * The menu item selected.
   */
  selectedMenuItemKey: PropTypes.string,

  /**
   * Callback on selecting a terminal menu item.
   */
  onTerminalMenuItemSelection: PropTypes.func.isRequired,

  /**
   * Sets initial menu open state.
   */
  isMenuOpen: PropTypes.bool,

  /**
   * Hide the dev tools part of the toolbar.
   */
  hideDevTools: PropTypes.bool,

  /**
   * The element to display in the main content area.
   */
  children: PropTypes.element.isRequired,

  /**
   * @private Passed in through withActiveBreakpoint
   */
  activeBreakpoint: PropTypes.string.isRequired,
};

class SecondaryNavigationLayout extends React.Component {
  static buildAncestorMap(menuItems) {
    const ancestorMap = {};
    menuItems.forEach((item) => {
      ancestorMap[item.key] = SecondaryNavigationLayout.findAncestor(item.key, menuItems);
    });

    return ancestorMap;
  }

  static findAncestor(key, menuItems) {
    for (let i = 0, numberOfItems = menuItems.length; i < numberOfItems; i += 1) {
      const item = menuItems[i];
      if (item.childKeys && item.childKeys.indexOf(key) >= 0) {
        return item;
      }
    }
    return undefined;
  }

  static buildSelectionPath(key, ancestorMap) {
    if (ancestorMap[key]) {
      return [...SecondaryNavigationLayout.buildSelectionPath(ancestorMap[key].key, ancestorMap)].concat([key]);
    }

    return [key];
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    if (state.previousActiveBreakpoint !== props.activeBreakpoint) {
      newState.previousActiveBreakpoint = props.activeBreakpoint;
    }

    if (!isCompactLayout(props.activeBreakpoint) && state.compactMenuIsOpen) {
      /**
       * The compact menu state is reset when a non-compact breakpoint is active.
       */
      newState.compactMenuIsOpen = false;
    }

    return newState;
  }

  static flattenMenuItems(menuItems) {
    return menuItems.reduce((accumulatedMenuItems, item) => {
      let generatedMenuItems = [{
        text: item.text,
        key: item.path,
        hasSubMenu: item.hasSubMenu,
        childKeys: item.childItems && item.childItems.map(childItem => childItem.path),
        metaData: !item.hasSubMenu ? {
          path: item.path,
        } : undefined,
      }];

      if (item.childItems) {
        generatedMenuItems = generatedMenuItems.concat(SecondaryNavigationLayout.flattenMenuItems(item.childItems));
      }

      return accumulatedMenuItems.concat(generatedMenuItems);
    }, []);
  }

  constructor(props) {
    super(props);
    this.closeMenu = this.closeMenu.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.handleCollapsingMenuSelection = this.handleCollapsingMenuSelection.bind(this);

    const flattenedMenuItems = SecondaryNavigationLayout.flattenMenuItems(props.menuItems);

    this.ancestorMap = SecondaryNavigationLayout.buildAncestorMap(flattenedMenuItems);

    this.state = {
      flattenedMenuItems,
      previousActiveBreakpoint: props.activeBreakpoint,
      compactMenuIsOpen: props.isMenuOpen,
      menuIsPinnedOpen: true,
    };
  }

  componentDidUpdate() {
    if (shouldFocusToggle) {
      document.getElementById('terra-dev-site-menu-toggle').focus();
      shouldFocusToggle = false;
    }
    if (shouldFocusMenu) {
      document.getElementById('terra-dev-site-nav-menu').focus();
      shouldFocusMenu = false;
    }
  }

  handleCollapsingMenuSelection(selectionKey) {
    const { onTerminalMenuItemSelection } = this.props;
    const { flattenedMenuItems } = this.state;

    const selectedItem = flattenedMenuItems.find(item => item.key === selectionKey);

    this.setState({
      compactMenuIsOpen: false,
    }, () => {
      // If an endpoint has been reached, reset selection path and update.
      if (onTerminalMenuItemSelection) {
        onTerminalMenuItemSelection(selectionKey, selectedItem.metaData);
      }
    });
  }

  closeMenu() {
    const { activeBreakpoint } = this.props;

    const isCompact = isCompactLayout(activeBreakpoint);

    if (isCompact) {
      shouldFocusToggle = true;
      this.setState({
        compactMenuIsOpen: false,
      });
    } else {
      this.setState({
        menuIsPinnedOpen: false,
      });
    }
  }

  openMenu() {
    const { activeBreakpoint } = this.props;

    const isCompact = isCompactLayout(activeBreakpoint);
    if (isCompact) {
      shouldFocusMenu = true;
      this.setState({
        compactMenuIsOpen: true,
      });
    } else {
      this.setState({
        menuIsPinnedOpen: true,
      });
    }
  }

  render() {
    const {
      children,
      menuItems,
      activeBreakpoint,
      selectedMenuItemKey,
      hideDevTools,
    } = this.props;

    const theme = this.context;

    const {
      compactMenuIsOpen,
      menuIsPinnedOpen,
    } = this.state;

    const isCompact = isCompactLayout(activeBreakpoint);
    const menuIsVisible = isCompact ? compactMenuIsOpen : menuIsPinnedOpen;
    /**
     * At within compact viewports, the navigation menu should render each menu item as if it has
     * a submenu, as selecting a childless item will cause the menu close.
     */

    let onToggle;
    if (isCompact) {
      onToggle = compactMenuIsOpen ? this.closeMenu : this.openMenu;
    } else {
      onToggle = menuIsPinnedOpen ? this.closeMenu : this.openMenu;
    }

    return (
      <div className={cx(['container', { 'panel-is-open': menuIsVisible }], theme.className)}>
        <div className={cx('panel')}>
          <CollapsingNavigationMenu
            menuItems={menuItems}
            selectedPath={selectedMenuItemKey}
            onSelect={this.handleCollapsingMenuSelection}
          />
        </div>
        <ContentContainer
          className={cx('content')}
          header={(
            <ComponentToolbar
              menuIsVisible={menuIsVisible}
              onToggle={onToggle}
              hideDevTools={hideDevTools}
            />
          )}
          fill
        >
          <ApplicationLoadingOverlayProvider>
            <ApplicationStatusOverlayProvider>
              {children}
            </ApplicationStatusOverlayProvider>
          </ApplicationLoadingOverlayProvider>
        </ContentContainer>
      </div>
    );
  }
}

SecondaryNavigationLayout.propTypes = propTypes;
SecondaryNavigationLayout.contextType = ThemeContext;

export default withActiveBreakpoint(SecondaryNavigationLayout);
export {
  isCompactLayout,
};
