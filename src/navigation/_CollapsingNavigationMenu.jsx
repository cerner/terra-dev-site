import React, {
  useState, useRef, useEffect, useContext,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import * as KeyCode from 'keycode-js';

import { ThemeContext } from 'terra-application/lib/theme';
import { menuItemPropType } from '../site/siteConfigPropTypes';
import CollapsingNavigationMenuItem from './_CollapsingNavigationMenuItem';

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
  const currentNodeId = useRef();
  const cursor = useRef(0);
  const selectedItem = useRef();
  const previousSelectedPath = useRef(selectedPath);
  const theme = useContext(ThemeContext);
  const visibleNodes = [];

  /**
   * Sets tabindex for current node
   */
  const setTabIndex = (val) => {
    const currentNode = currentNodeId.current ? document.getElementById(currentNodeId.current) : null;
    if (currentNode) {
      currentNode.setAttribute('tabIndex', val);
    }
  };

  /**
   * Assigns focus to current node.
   */
  const focusCurrentNode = () => {
    const currentNode = currentNodeId.current ? document.getElementById(currentNodeId.current) : null;
    if (currentNode) {
      currentNode.focus();
    }
  };

  /**
   * Scrolls the currently selected menu item into view on mount.
   * Ensures that the cursor is synched with the currently selected item.
   */
  useEffect(() => {
    let idx;
    const nodeId = selectedItem.current?.getAttribute('id');
    if (!nodeId) {
      idx = 0;
    } else {
      idx = visibleNodes.findIndex((el) => el.id === nodeId);
    }

    if (idx >= 0) {
      cursor.current = idx;
      currentNodeId.current = visibleNodes[cursor.current].id;
      setTabIndex('0');
    }
    if (selectedItem && selectedItem.current) {
      selectedItem.current.scrollIntoView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const nodeId = selectedItem.current?.getAttribute('id');
    const idx = visibleNodes.findIndex((el) => el.id === nodeId);
    if (idx >= 0) {
      cursor.current = idx;
      currentNodeId.current = visibleNodes[cursor.current].id;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPath]);

  /**
   * Ensures that the cursor is synched with the currently selected item.
   * Scrolls selected item into view.
   */
  useEffect(() => {
    if (currentNodeId.current) {
      cursor.current = visibleNodes.findIndex((el) => el.id === currentNodeId.current);
    }
    if (previousSelectedPath.current !== selectedPath) {
      const selectedItemPosition = selectedItem?.current ? selectedItem.current.getBoundingClientRect() : null;
      const navigationMenuPosition = document.querySelector('#terra-dev-site-nav-menu').getBoundingClientRect();
      if (selectedItemPosition && navigationMenuPosition && (selectedItemPosition.bottom > navigationMenuPosition.bottom || selectedItemPosition.top < navigationMenuPosition.top)) {
        selectedItem.current.scrollIntoView();
      }
      previousSelectedPath.current = selectedPath;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openKeys]);

  /**
   * Ensures the parent of the currently selected item is expanded.
   */
  useEffect(() => {
    setOpenKeys({ ...openKeys, ...openKeysToItem(menuItems[0], selectedPath) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPath]);

  const handleOnClick = (event, item) => {
    // Don't update state if function is called through handleKeyDown
    if (event.type === 'click') {
      setTabIndex('-1');
      const eventTargetId = event.target.getAttribute('id');
      currentNodeId.current = eventTargetId;
      cursor.current = visibleNodes.findIndex((el) => el.id === eventTargetId);
      setTabIndex('0');
      focusCurrentNode();
    }
    if (!item.childItems) {
      onSelect(item.path);
      return;
    }
    setOpenKeys({ ...openKeys, [item.path]: !openKeys[item.path] });
  };

  const handleDownArrow = () => {
    if (cursor.current + 1 < visibleNodes.length) {
      setTabIndex('-1');
      cursor.current += 1;
      currentNodeId.current = visibleNodes[cursor.current].id;
      setTabIndex('0');
      focusCurrentNode();
    }
  };

  const handleUpArrow = () => {
    if (cursor.current >= 1) {
      setTabIndex('-1');
      cursor.current -= 1;
      currentNodeId.current = visibleNodes[cursor.current].id;
      setTabIndex('0');
      focusCurrentNode();
    }
  };

  /**
   * Finds parent of the current node, used for left arrow functionality
   */
  const findParentNode = () => {
    if (!currentNodeId.current) {
      return;
    }
    const parentId = visibleNodes.find((el) => el.id === currentNodeId.current).parent;
    if (parentId) {
      setTabIndex('-1');
      cursor.current = visibleNodes.findIndex((el) => el.id === parentId);
      currentNodeId.current = visibleNodes[cursor.current].id;
      setTabIndex('0');
      focusCurrentNode();
    }
  };

  /**
   * Finds the first node starting with the given character.
   * Starts at the cursors current position, and wraps around to the beginning of the menu if a match isn't found.
   * @param {*} char The character to search by
   */
  const findNodeMatching = (char) => {
    let sortedNodes = visibleNodes.slice(cursor.current + 1, visibleNodes.length);
    sortedNodes = sortedNodes.concat(visibleNodes.slice(0, cursor.current));
    const match = sortedNodes.find((el) => el.id[0].toUpperCase() === char);
    if (match) {
      setTabIndex('-1');
      cursor.current = visibleNodes.findIndex((el) => el.id === match.id);
      currentNodeId.current = match.id;
      setTabIndex('0');
      focusCurrentNode();
    }
  };

  const handleKeyDown = (event, item) => {
    let expandedValue;
    switch (event.nativeEvent.keyCode) {
      case KeyCode.KEY_SPACE:
      case KeyCode.KEY_RETURN:
        event.preventDefault();
        handleOnClick(event, item);
        break;
      case KeyCode.KEY_DOWN:
        event.preventDefault();
        handleDownArrow();
        break;
      case KeyCode.KEY_UP:
        event.preventDefault();
        handleUpArrow();
        break;
      case KeyCode.KEY_RIGHT:
        event.preventDefault();
        if (currentNodeId.current) {
          expandedValue = document.getElementById(currentNodeId.current).getAttribute('aria-expanded');
          if (expandedValue) {
            if (expandedValue === 'true') {
              handleDownArrow();
            } else {
              handleOnClick(event, item);
            }
          }
        }
        break;
      case KeyCode.KEY_LEFT:
        event.preventDefault();
        if (currentNodeId.current) {
          expandedValue = document.getElementById(currentNodeId.current).getAttribute('aria-expanded');
          if (expandedValue && expandedValue === 'true') {
            handleOnClick(event, item);
          } else {
            findParentNode();
          }
        }
        break;
      case KeyCode.KEY_HOME:
        event.preventDefault();
        setTabIndex('-1');
        cursor.current = 0;
        currentNodeId.current = visibleNodes[cursor.current].id;
        setTabIndex('0');
        focusCurrentNode();
        break;
      case KeyCode.KEY_END:
        event.preventDefault();
        setTabIndex('-1');
        cursor.current = visibleNodes.length - 1;
        currentNodeId.current = visibleNodes[cursor.current].id;
        setTabIndex('0');
        focusCurrentNode();
        break;
      default:
        if (event.nativeEvent.keyCode >= KeyCode.KEY_A && event.nativeEvent.keyCode <= KeyCode.KEY_Z) {
          event.preventDefault();
          const char = String.fromCharCode(event.nativeEvent.keyCode);
          findNodeMatching(char);
        }
        break;
    }
  };

  const renderMenuItems = (currentMenuItem, parent = undefined, firstLevel = false, indexPath) => {
    if (!currentMenuItem) {
      return undefined;
    }

    return currentMenuItem.map((item, index) => {
      let currentPath;
      if (!indexPath) {
        currentPath = `idxPath-${index}`;
      } else {
        currentPath = `${indexPath}-${index}`;
      }
      const id = `${item.name.split(' ').join('-')}-${currentPath}`;
      const itemIsOpen = !!openKeys[item.path];
      const isSelected = selectedPath === item.path;

      visibleNodes.push({ id, parent });

      return (
        <CollapsingNavigationMenuItem
          id={id}
          key={id}
          item={item}
          itemIsOpen={itemIsOpen}
          isSelected={isSelected}
          childItems={itemIsOpen ? renderMenuItems(item.childItems, id, false, currentPath) : null}
          firstLevel={firstLevel}
          handleKeyDown={handleKeyDown}
          handleOnClick={handleOnClick}
          ref={isSelected ? selectedItem : null}
        />
      );
    });
  };

  return (
    <div
      className={cx('collapsing-navigation-menu', theme.className)}
      id="terra-dev-site-nav-menu"
      role="tree"
    >
      {menuItems ? renderMenuItems(menuItems[0].childItems, '', true) : undefined}
    </div>
  );
};

CollapsingNavigationMenu.propTypes = propTypes;

export default CollapsingNavigationMenu;
