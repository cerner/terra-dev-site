import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import * as KeyCode from 'keycode-js';

import IconCaretRight from 'terra-icon/lib/icon/IconCaretRight';
import IconCaretDown from 'terra-icon/lib/icon/IconCaretDown';
import { menuItemPropType } from '../site/siteConfigPropTypes';

import styles from './CollapsingNavigationMenu.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * Currently selected path
   */
  selectedPath: PropTypes.string,

  /**
   * menu items to display.
   */
  menuItems: menuItemPropType.isRequired,

  /**
   * On select callback
   */
  onSelect: PropTypes.func.isRequired,
};

const defaultProps = {
  selectedPath: undefined,
};

/**
 * Enables focus styles for the target of the given event. Typically used as an onBlur callback on selectable elements.
 */
const enableFocusStyles = (event) => {
  event.currentTarget.setAttribute('data-focus-styles-enabled', 'true');
};

/**
 * Disables focus styles for the target of the given event. Typically used as an onMouseDown callback on selectable elements.
 */
const disableFocusStyles = (event) => {
  event.currentTarget.setAttribute('data-focus-styles-enabled', 'false');
};

class CollapsingNavigationMenu extends React.Component {
  /**
   * Returns a list of keys in the tree to 'open' that lead to the selected path.
   * @param {*} item the item to traverse
   * @param {*} selectedPath the currently selected path
   */
  static keysToItem(item, selectedPath) {
    let paths = [];
    if (item.childItems) {
      item.childItems.some((childItem) => {
        if (selectedPath === childItem.path) {
          paths = [item.path];
          // if found bail early.
          return true;
        }

        const childPaths = CollapsingNavigationMenu.keysToItem(childItem, selectedPath);
        if (childPaths.length > 0) {
          paths = childPaths.concat([item.path]);
          // if found bail early.
          return true;
        }
        return false;
      });
    }

    return paths;
  }

  /**
   * Returns an object containing the keys of the items to open to reveal the selected path in the tree.
   * @param {*} menuItems list of all menu items
   * @param {*} selectedPath the currently selected path
   */
  static openKeysToItem(menuItems, selectedPath) {
    return CollapsingNavigationMenu.keysToItem(menuItems, selectedPath).reduce((acc, path) => {
      acc[path] = true;
      return acc;
    }, {});
  }

  static getDerivedStateFromProps({ menuItems, selectedPath }, state) {
    const newState = { isNewSelectedPath: false };
    if (state.previousSelectedPath !== selectedPath) {
      newState.isNewSelectedPath = true;
      newState.openKeys = { ...state.openKeys, ...CollapsingNavigationMenu.openKeysToItem(menuItems[0], selectedPath) };
      newState.previousSelectedPath = selectedPath;
    }
    return newState;
  }

  constructor(props) {
    super(props);
    const { menuItems, selectedPath } = props;
    this.renderMenuItems = this.renderMenuItems.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.selectedItem = React.createRef();

    this.state = {
      previousSelectedPath: selectedPath,
      openKeys: CollapsingNavigationMenu.openKeysToItem(menuItems[0], selectedPath),
      isNewSelectedPath: false,
    };
  }

  componentDidMount() {
    if (this.selectedItem && this.selectedItem.current) {
      this.selectedItem.current.scrollIntoView();
    }
  }

  componentDidUpdate() {
    const { isNewSelectedPath } = this.state;
    if (isNewSelectedPath && this.selectedItem && this.selectedItem.current) {
      this.selectedItem.current.scrollIntoView();
    }
  }

  handleKeyDown(event, item) {
    if (event.nativeEvent.keyCode === KeyCode.KEY_SPACE || event.nativeEvent.keyCode === KeyCode.KEY_RETURN) {
      this.handleOnClick(event, item);
    }
  }

  handleOnClick(event, item) {
    const { onSelect } = this.props;
    const { openKeys } = this.state;

    if (!item.childItems) {
      onSelect(item.path);
      return;
    }
    openKeys[item.path] = !openKeys[item.path];
    this.setState({ openKeys });
  }

  renderMenuItems(menuItems, firstLevel) {
    const { selectedPath } = this.props;
    const { openKeys } = this.state;

    if (!menuItems) {
      return undefined;
    }

    return menuItems.map((item) => {
      const itemIsOpen = openKeys[item.path];
      const itemHasChildren = item.childItems !== undefined;
      let isSelected = false;
      let selectedRef;

      if (selectedPath === item.path) {
        isSelected = true;
        selectedRef = this.selectedItem;
      }

      return (
        <React.Fragment key={item.path}>
          <div className={!firstLevel ? cx('indent') : null}>
            <div
              className={cx(['item', { 'is-selected': isSelected }])}
              tabIndex="0"
              role="link"
              aria-haspopup={itemHasChildren}
              onKeyDown={event => this.handleKeyDown(event, item)}
              onClick={event => this.handleOnClick(event, item)}
              onBlur={enableFocusStyles}
              onMouseDown={disableFocusStyles}
              data-focus-styles-enabled
              ref={selectedRef}
            >
              {itemHasChildren ? <span className={cx('disclosure')}>{ itemIsOpen ? <IconCaretDown className={cx('caret')} /> : <IconCaretRight className={cx('caret')} />}</span> : null}
              {item.name}
            </div>
            {itemIsOpen ? this.renderMenuItems(item.childItems) : null}
          </div>
        </React.Fragment>
      );
    });
  }

  render() {
    const { menuItems } = this.props;
    return (
      <div className={cx('collapsing-navigation-menu')} id="terra-dev-site-nav-menu" tabIndex="-1">
        {menuItems ? this.renderMenuItems(menuItems[0].childItems, true) : undefined}
      </div>
    );
  }
}

CollapsingNavigationMenu.propTypes = propTypes;
CollapsingNavigationMenu.defaultProps = defaultProps;

export default CollapsingNavigationMenu;
