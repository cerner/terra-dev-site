import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { withActiveBreakpoint } from 'terra-application/lib/breakpoints';
import Overlay from 'terra-overlay';
import FocusTrap from 'focus-trap-react';
import ContentContainer from 'terra-content-container';

import SecondaryNavigationLayoutActionHeader from './_SecondaryNavigationLayoutActionHeader';
import CollapsingNavigationMenu from './_CollapsingNavigationMenu';
import SecondaryNavigationContext from './_SecondaryNavigationContext';
import SecondaryNavHeaderAdapter from './_SecondaryNavHeaderAdapter';

import styles from './SecondaryNavigationLayout.module.scss';

const cx = classNames.bind(styles);

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
      newState.defaultContentProviderValue = Object.assign({}, state.defaultContentProviderValue, { menuIsVisible: state.menuIsPinnedOpen });
    } else if (isCompactLayout(props.activeBreakpoint)) {
      newState.defaultContentProviderValue = Object.assign({}, state.defaultContentProviderValue, { menuIsVisible: state.compactMenuisOpen });
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
    this.setHeaderContent = this.setHeaderContent.bind(this);

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
      headerTitle: '',
      headerContent: undefined,
      flattenedMenuItems,
      previousActiveBreakpoint: props.activeBreakpoint, // eslint-disable-line react/no-unused-state
      selectedMenuKey,
      selectedChildKey,
      selectionPath,
      compactMenuIsOpen: false,
      menuIsPinnedOpen: true,
      defaultContentProviderValue: {
        setHeaderContent: this.setHeaderContent,
      },
    };
  }

  setHeaderContent(content) {
    this.setState({
      headerTitle: content.title,
      headerContent: content.content,
    });
  }

  closeMenu() {
    const { activeBreakpoint } = this.props;

    const isCompact = isCompactLayout(activeBreakpoint);

    if (isCompact) {
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
      this.setState({
        compactMenuIsOpen: true,
      });
    } else {
      this.setState({
        menuIsPinnedOpen: true,
      });
    }
  }

  handleCollapsingMenuSelection(selectionKey) {
    const { onTerminalMenuItemSelection } = this.props;
    const { flattenedMenuItems } = this.state;

    const selectedItem = flattenedMenuItems.find(item => item.key === selectionKey);

    this.setState({
      selectedChildKey: selectionKey,
      compactMenuIsOpen: false,
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
      compactMenuIsOpen,
      menuIsPinnedOpen,
      defaultContentProviderValue,
      selectedChildKey,
      headerTitle,
      headerContent,
    } = this.state;

    const isCompact = isCompactLayout(activeBreakpoint);
    const menuIsVisible = isCompact ? compactMenuIsOpen : menuIsPinnedOpen;
    /**
     * At within compact viewports, the navigation menu should render each menu item as if it has
     * a submenu, as selecting a childless item will cause the menu close.
     */
    const menu = (
      <FocusTrap
        active={isCompact ? compactMenuIsOpen : false}
        focusTrapOptions={{
          escapeDeactivates: true,
          clickOutsideDeactivates: true,
          returnFocusOnDeactivate: true,
          onDeactivate: () => {
            this.setState({
              compactMenuIsOpen: false,
            });
          },
        }}
        className={cx('focus-trap-container')}
      >
        <CollapsingNavigationMenu
          menuItems={menuItems}
          selectedPath={selectedChildKey}
          onSelect={this.handleCollapsingMenuSelection}
        />
      </FocusTrap>
    );

    let onToggle;
    if (isCompact) {
      onToggle = compactMenuIsOpen ? this.closeMenu : this.openMenu;
    } else {
      onToggle = menuIsPinnedOpen ? this.closeMenu : this.openMenu;
    }

    return (
      <div className={cx(['container', { 'panel-is-open': menuIsVisible }])}>
        <div className={cx('panel')}>
          {menu}
        </div>
        <div className={cx('content')}>
          <SecondaryNavigationContext.Provider
            value={defaultContentProviderValue}
          >
            <ContentContainer
              header={<SecondaryNavigationLayoutActionHeader title={headerTitle} content={headerContent} menuIsVisible={menuIsVisible} onToggle={onToggle} />}
              fill
            >
              {children}
            </ContentContainer>
          </SecondaryNavigationContext.Provider>
          <Overlay isOpen={isCompact ? compactMenuIsOpen : false} isRelativeToContainer style={{ top: '0' }} />
        </div>
      </div>
    );
  }
}

SecondaryNavigationLayout.propTypes = propTypes;

export default withActiveBreakpoint(SecondaryNavigationLayout);
export {
  isCompactLayout,
};
