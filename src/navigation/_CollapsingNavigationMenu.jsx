import React, {
  useState, useRef, useEffect, useContext,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import * as KeyCode from 'keycode-js';

import IconCaretRight from 'terra-icon/lib/icon/IconCaretRight';
import IconCaretDown from 'terra-icon/lib/icon/IconCaretDown';
import { ThemeContext } from 'terra-application/lib/theme';
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

/**
 * Returns a list of keys in the tree to 'open' that lead to the selected path.
 * @param {*} item the item to traverse
 * @param {*} selectedPath the currently selected path
 */
const keysToItem = (item, selectedPath) => {
  let paths = [];
  if (item.childItems) {
    item.childItems.some((childItem) => {
      if (selectedPath === childItem.path) {
        paths = [item.path];
        // if found bail early.
        return true;
      }

      const childPaths = keysToItem(childItem, selectedPath);
      if (childPaths.length > 0) {
        paths = childPaths.concat([item.path]);
        // if found bail early.
        return true;
      }
      return false;
    });
  }

  return paths;
};

/**
 * Returns an object containing the keys of the items to open to reveal the selected path in the tree.
 * @param {*} menuItems list of all menu items
 * @param {*} selectedPath the currently selected path
 */
const openKeysToItem = (menuItems, selectedPath) => keysToItem(menuItems, selectedPath).reduce((acc, path) => {
  acc[path] = true;
  return acc;
}, {});

const CollapsingNavigationMenu = ({ selectedPath = undefined, menuItems, onSelect }) => {
  const [openKeys, setOpenKeys] = useState(openKeysToItem(menuItems[0], selectedPath));
  const [currentNodeId, setCurrentNodeId] = useState();
  const cursor = useRef(0);
  const selectedItem = useRef();
  const theme = useContext(ThemeContext);
  const visibleNodes = [];

  /**
   * Scrolls the currently selected menu item into view on mount.
   */
  useEffect(() => {
    if (selectedItem && selectedItem.current) {
      selectedItem.current.scrollIntoView();
    }
  }, []);

  /**
   * Updates cursor position when new menu items are loaded.
   * If the item emphasized through keyboard navigation is not visible, scroll it into view.
   */
  useEffect(() => {
    cursor.current = visibleNodes.findIndex((el) => el.id === currentNodeId);
    const currentNode = currentNodeId ? document.querySelector(`#${currentNodeId}`) : null;
    const currentNodePosition = currentNode ? currentNode.getBoundingClientRect() : null;
    const navigationMenuPosition = document.querySelector('#terra-dev-site-nav-menu').getBoundingClientRect();

    if (currentNode) {
      currentNode.focus();
    }
    if (currentNode && currentNodePosition && (currentNodePosition.bottom > navigationMenuPosition.bottom || currentNodePosition.top < navigationMenuPosition.top)) {
      currentNode.scrollIntoView();
    }
  }, [currentNodeId, visibleNodes]);

  /**
   * If the current item is not visible, scroll the item into view.
   */
  useEffect(() => {
    const selectedItemPosition = selectedItem?.current ? selectedItem.current.getBoundingClientRect() : null;
    const navigationMenuPosition = document.querySelector('#terra-dev-site-nav-menu').getBoundingClientRect();
    if (selectedItemPosition && navigationMenuPosition && (selectedItemPosition.bottom > navigationMenuPosition.bottom || selectedItemPosition.top < navigationMenuPosition.top)) {
      selectedItem.current.scrollIntoView();
    }
  }, [openKeys]);

  /**
   * Ensure the currently selected menu item is visible.
   */
  useEffect(() => {
    setOpenKeys({ ...openKeys, ...openKeysToItem(menuItems[0], selectedPath) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPath]);

  const handleOnClick = (event, item) => {
    if (!item.childItems) {
      onSelect(item.path);
      return;
    }
    setOpenKeys({ ...openKeys, [item.path]: !openKeys[item.path] });
  };

  const handleDownArrow = () => {
    if (cursor.current + 1 < visibleNodes.length) {
      cursor.current += 1;
      setCurrentNodeId(visibleNodes[cursor.current].id);
    }
  };

  const handleUpArrow = () => {
    if (cursor.current >= 1) {
      cursor.current -= 1;
      setCurrentNodeId(visibleNodes[cursor.current].id);
    }
  };

  const findParent = () => {
    if (!currentNodeId) {
      return;
    }
    const parentId = visibleNodes.find((el) => el.id === currentNodeId).parent;
    if (parentId !== '') {
      cursor.current = visibleNodes.findIndex((el) => el.id === parentId);
      setCurrentNodeId(visibleNodes[cursor.current].id);
    }
  };

  const findNode = (char) => {
    let sortedNodes = visibleNodes.slice(cursor.current + 1, visibleNodes.length);
    sortedNodes = sortedNodes.concat(visibleNodes.slice(0, cursor.current));
    const match = sortedNodes.find((el) => el.id[0].toUpperCase() === char);
    if (match) {
      cursor.current = visibleNodes.findIndex((el) => el.id === match.id);
      setCurrentNodeId(match.id);
    }
  };

  const handleKeyDown = (event, item) => {
    if (event.nativeEvent.keyCode === KeyCode.KEY_SPACE || event.nativeEvent.keyCode === KeyCode.KEY_RETURN) {
      event.preventDefault();
      handleOnClick(event, item);
    } else if (event.nativeEvent.keyCode === KeyCode.KEY_DOWN) {
      event.preventDefault();
      handleDownArrow();
    } else if (event.nativeEvent.keyCode === KeyCode.KEY_UP) {
      event.preventDefault();
      handleUpArrow();
    } else if ((event.nativeEvent.keyCode === KeyCode.KEY_RIGHT || event.nativeEvent.keyCode === KeyCode.KEY_LEFT) && !currentNodeId) {
      event.preventDefault();
    } else if (event.nativeEvent.keyCode === KeyCode.KEY_RIGHT) {
      event.preventDefault();
      if (document.getElementById(currentNodeId).ariaExpanded === 'true') {
        handleDownArrow();
      } else if (document.getElementById(currentNodeId).ariaHasPopup && (!document.getElementById(currentNodeId).ariaExpanded || document.getElementById(currentNodeId).ariaExpanded === 'false')) {
        handleOnClick(event, item);
      }
    } else if (event.nativeEvent.keyCode === KeyCode.KEY_LEFT) {
      event.preventDefault();
      if (document.getElementById(currentNodeId).ariaExpanded === 'true') {
        handleOnClick(event, item);
      } else if (!document.getElementById(currentNodeId).ariaHasPopup || !document.getElementById(currentNodeId).ariaExpanded || document.getElementById(currentNodeId).ariaExpanded === 'false') {
        findParent();
      }
    } else if (event.nativeEvent.keyCode === KeyCode.KEY_HOME) {
      event.preventDefault();
      cursor.current = 0;
      setCurrentNodeId(visibleNodes[cursor.current].id);
    } else if (event.nativeEvent.keyCode === KeyCode.KEY_END) {
      event.preventDefault();
      cursor.current = visibleNodes.length - 1;
      setCurrentNodeId(visibleNodes[cursor.current].id);
    } else if (event.nativeEvent.keyCode >= KeyCode.KEY_A && event.nativeEvent.keyCode <= KeyCode.KEY_Z) {
      event.preventDefault();
      const char = String.fromCharCode(event.nativeEvent.keyCode);
      findNode(char);
    } else if (event.nativeEvent.shiftKey && event.nativeEvent.keyCode === KeyCode.KEY_TAB) {
      handleUpArrow();
    } else if (event.nativeEvent.keyCode === KeyCode.KEY_TAB) {
      handleDownArrow();
    }
  };

  const renderMenuItems = (currentMenuItem, parent = '', firstLevel = false) => {
    if (!currentMenuItem) {
      return undefined;
    }

    return currentMenuItem.map((item) => {
      const itemIsOpen = openKeys[item.path];
      const itemHasChildren = item.childItems !== undefined;
      const id = item.name.split(' ').join('-');
      let isSelected = false;
      let selectedRef;

      if (selectedPath === item.path) {
        isSelected = true;
        selectedRef = selectedItem;
      } else if (currentNodeId === id) {
        isSelected = true;
      }

      visibleNodes.push({ id, parent });
      const menuItemClassNames = classNames(
        cx([
          'item',
          { 'is-selected': isSelected },
        ]),
      );

      const optionalAttributes = itemHasChildren ? { 'aria-expanded': itemIsOpen, 'aria-haspopup': true } : {};

      return (
        <React.Fragment key={item.path}>
          <div className={!firstLevel ? cx('indent') : null}>
            <div
              className={menuItemClassNames}
              tabIndex="0"
              role="treeitem"
              id={id}
              onKeyDown={event => handleKeyDown(event, item)}
              onClick={event => handleOnClick(event, item)}
              onBlur={enableFocusStyles}
              onMouseDown={disableFocusStyles}
              data-focus-styles-enabled
              ref={selectedRef}
              {...optionalAttributes}
            >
              {itemHasChildren ? <span className={cx('disclosure')}>{ itemIsOpen ? <IconCaretDown className={cx('caret')} /> : <IconCaretRight className={cx('caret')} />}</span> : null}
              {item.name}
            </div>
            {itemIsOpen ? renderMenuItems(item.childItems, id) : null}
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className={cx('collapsing-navigation-menu', theme.className)} id="terra-dev-site-nav-menu" tabIndex="-1" role="tree">
      {menuItems ? renderMenuItems(menuItems[0].childItems, '', true) : undefined}
    </div>
  );
};

CollapsingNavigationMenu.propTypes = propTypes;

export default CollapsingNavigationMenu;
