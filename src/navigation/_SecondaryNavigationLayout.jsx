import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Breakpoints } from 'terra-application';
import NavigationSideMenu from 'terra-navigation-side-menu';

import CollapsingNavigationMenu from './_CollapsingNavigationMenu';

import styles from './SecondaryNavigationLayout.module.scss';

const cx = classNames.bind(styles);

const SecondaryNavigationLayoutContext = React.createContext();

const withSecondaryNavigationLayout = (WrappedComponent) => {
  const WithSecondaryNavigationLayoutComp = props => (
    <SecondaryNavigationLayoutContext.Consumer>
      {secondaryNavigationLayout => <WrappedComponent {...props} secondaryNavigationLayout={secondaryNavigationLayout} />}
    </SecondaryNavigationLayoutContext.Consumer>
  );

  WithSecondaryNavigationLayoutComp.WrappedComponent = WrappedComponent;
  WithSecondaryNavigationLayoutComp.displayName = `withSecondaryNavigationLayout(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithSecondaryNavigationLayoutComp;
};

const isCompactLayout = activeBreakpoint => activeBreakpoint === 'tiny' || activeBreakpoint === 'small';

const propTypes = {
  menuItems: PropTypes.array,
  initialSelectedMenuItemKey: PropTypes.string,
  onTerminalMenuItemSelection: PropTypes.func,
  /**
   * The element to display in the main content area.
   */
  children: PropTypes.element,
  /**
   * @private
   */
  activeBreakpoint: PropTypes.string,
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

    if ((!isCompactLayout(state.previousActiveBreakpoint) && isCompactLayout(props.activeBreakpoint))
    || (isCompactLayout(state.previousActiveBreakpoint) && !isCompactLayout(props.activeBreakpoint))) {
      if (state.selectionPath) {
        newState.selectedMenuKey = state.selectionPath[state.selectionPath.length - 2];
        newState.selectedChildKey = state.selectionPath[state.selectionPath.length - 1];
      }
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

    this.openCompactMenu = this.openCompactMenu.bind(this);
    this.pinMenu = this.pinMenu.bind(this);
    this.unpinMenu = this.unpinMenu.bind(this);
    this.handleMenuItemSelection = this.handleMenuItemSelection.bind(this);
    this.handleCollapsingMenuSelection = this.handleCollapsingMenuSelection.bind(this);

    const flattenedMenuItems = SecondaryNavigationLayout.flattenMenuItems(props.menuItems);

    this.ancestorMap = SecondaryNavigationLayout.buildAncestorMap(flattenedMenuItems);
    const selectedItem = flattenedMenuItems.find(item => item.key === props.initialSelectedMenuItemKey);
    const parentItem = this.ancestorMap[props.initialSelectedMenuItemKey];

    let selectedMenuKey;
    let selectedChildKey;
    let selectionPath;
    if (selectedItem.childKeys && selectedItem.childKeys.length) {
      selectedMenuKey = selectedItem.key;
      selectedChildKey = undefined;
      selectionPath = undefined;
    } else if (parentItem) {
      selectedMenuKey = parentItem.key;
      selectedChildKey = selectedItem.key;
      selectionPath = SecondaryNavigationLayout.buildSelectionPath(selectedItem.key, this.ancestorMap);
    }

    this.state = {
      flattenedMenuItems,
      previousActiveBreakpoint: props.activeBreakpoint, // eslint-disable-line react/no-unused-state
      selectedMenuKey,
      selectedChildKey,
      selectionPath,
      compactMenuIsOpen: false,
      menuIsPinnedOpen: true,
      compactContentProviderValue: {
        openMenu: this.openCompactMenu,
      },
      defaultContentProviderValue: {
        pinMenu: this.pinMenu,
        unpinMenu: this.unpinMenu,
        menuIsPinned: true,
      },
    };
  }

  openCompactMenu() {
    this.setState({
      compactMenuIsOpen: true,
    });
  }

  pinMenu() {
    this.setState({
      menuIsPinnedOpen: true,
      defaultContentProviderValue: {
        pinMenu: this.pinMenu,
        unpinMenu: this.unpinMenu,
        menuIsPinned: true,
      },
    });
  }

  unpinMenu() {
    this.setState({
      menuIsPinnedOpen: false,
      defaultContentProviderValue: {
        pinMenu: this.pinMenu,
        unpinMenu: this.unpinMenu,
        menuIsPinned: false,
      },
    });
  }

  handleMenuItemSelection(event, selectionData) {
    const { onTerminalMenuItemSelection } = this.props;
    const { selectionPath, flattenedMenuItems } = this.state;

    const newChildKey = selectionData.selectedChildKey;
    const newMenuKey = selectionData.selectedMenuKey;

    const newChildItem = flattenedMenuItems.find(item => item.key === newChildKey);

    // If an endpoint has been reached, reset selection path and update.
    if (newChildKey && !newChildItem.childKeys) {
      this.setState({
        compactMenuIsOpen: false,
        selectionPath: SecondaryNavigationLayout.buildSelectionPath(newChildKey, this.ancestorMap),
        selectedChildKey: newChildKey,
        selectedMenuKey: newMenuKey,
      }, () => {
        if (onTerminalMenuItemSelection) {
          onTerminalMenuItemSelection(newChildKey, selectionData.metaData);
        }
      });

      return;
    }

    if (selectionPath && selectionPath.indexOf(newChildKey) >= 0) {
      this.setState({
        selectedMenuKey: newMenuKey,
        selectedChildKey: newChildKey,
      });
    } else if (selectionPath && selectionPath.indexOf(newMenuKey) >= 0) {
      this.setState({
        selectedMenuKey: newMenuKey,
        selectedChildKey: selectionPath[selectionPath.indexOf(newMenuKey) + 1],
      });
    } else {
      this.setState({
        selectedMenuKey: newMenuKey,
        selectedChildKey: undefined,
      });
    }
  }

  handleCollapsingMenuSelection(selectionKey) {
    const { onTerminalMenuItemSelection } = this.props;
    const { selectionPath, flattenedMenuItems } = this.state;

    const selectedItem = flattenedMenuItems.find(item => item.key === selectionKey);

    this.setState({
      selectedChildKey: selectionKey,
    }, () => {
    // If an endpoint has been reached, reset selection path and update.
      if (onTerminalMenuItemSelection) {
        onTerminalMenuItemSelection(selectionKey, selectedItem.metaData);
      }
    });
  }

  render() {
    const {
      children,
      menuItems,
      activeBreakpoint,
    } = this.props;

    const {
      flattenedMenuItems,
      compactMenuIsOpen,
      menuIsPinnedOpen,
      compactContentProviderValue,
      defaultContentProviderValue,
      selectedMenuKey,
      selectedChildKey,
    } = this.state;

    const isCompact = isCompactLayout(activeBreakpoint);

    /**
     * At within compact viewports, the navigation menu should render each menu item as if it has
     * a submenu, as selecting a childless item will cause the menu close.
     */
    let managedMenuItems = flattenedMenuItems;
    let menu;
    if (activeBreakpoint === 'tiny' || activeBreakpoint === 'small') {
      managedMenuItems = managedMenuItems.map(item => (
        Object.assign({}, item, { hasSubMenu: true })
      ));

      menu = (
        <NavigationSideMenu
          menuItems={managedMenuItems}
          selectedMenuKey={selectedMenuKey}
          selectedChildKey={!isCompact ? selectedChildKey : null}
          onChange={this.handleMenuItemSelection}
        />
      );
    } else {
      menu = (
        <CollapsingNavigationMenu
          menuItems={menuItems}
          selectedPath={selectedChildKey}
          onSelect={this.handleCollapsingMenuSelection}
        />
      );
    }

    return (
      <div className={cx(['container', { 'panel-is-open': isCompact ? compactMenuIsOpen : menuIsPinnedOpen }])}>
        <div className={cx('panel')}>
          {menu}
        </div>
        <div className={cx('content')}>
          <SecondaryNavigationLayoutContext.Provider
            value={isCompact ? compactContentProviderValue : defaultContentProviderValue}
          >
            {children}
          </SecondaryNavigationLayoutContext.Provider>
        </div>
      </div>
    );
  }
}

SecondaryNavigationLayout.propTypes = propTypes;

export default Breakpoints.withActiveBreakpoint(SecondaryNavigationLayout);
export {
  SecondaryNavigationLayoutContext,
  withSecondaryNavigationLayout,
  isCompactLayout,
};
