import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import KeyCode from 'keycode-js';

import IconCaretRight from 'terra-icon/lib/icon/IconCaretRight';
import IconCaretDown from 'terra-icon/lib/icon/IconCaretDown';

import styles from './CollapsingNavigationMenu.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  selectedPath: PropTypes.string,
  menuItems: PropTypes.PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    path: PropTypes.string,
  })),
  onSelect: PropTypes.func.isRequired,
};

const defaultProps = {
  menuItems: undefined,
  selectedPath: undefined,
};

class CollapsingNavigationMenu extends React.Component {
  static keysToItem(item, selectedPath) {
    let paths = [];
    if (item.childItems) {
      item.childItems.some((childItem) => {
        if (selectedPath === childItem.path) {
          paths = [item.path];
          return true;
        }

        const childPaths = CollapsingNavigationMenu.keysToItem(childItem, selectedPath);
        if (childPaths.length > 0) {
          paths = childPaths.concat([item.path]);
          return true;
        }
        return false;
      });
    }

    return paths;
  }

  static openKeysToItem(menuItems, selectedPath) {
    return CollapsingNavigationMenu.keysToItem(menuItems, selectedPath).reduce((acc, path) => {
      acc[path] = true;
      return acc;
    }, {});
  }

  static getDerivedStateFromProps({ menuItems, selectedPath }, state) {
    const newState = {};
    if (state.previousSelectedPath !== selectedPath) {
      newState.openKeys = Object.assign({}, state.openKeys, CollapsingNavigationMenu.openKeysToItem(menuItems[0], selectedPath));
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

    this.state = {
      previousSelectedPath: selectedPath,
      openKeys: CollapsingNavigationMenu.openKeysToItem(menuItems[0], selectedPath),
    };
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
      const itemHasChildren = item.childItems;

      return (
        <React.Fragment key={item.path}>
          <div style={!firstLevel ? { paddingLeft: '15px' } : null}>
            <div
              className={cx(['item', { 'is-selected': selectedPath === item.path }])}
              tabIndex="0"
              role="button"
              onKeyDown={event => this.handleKeyDown(event, item)}
              onClick={event => this.handleOnClick(event, item)}
            >
              {itemHasChildren ? <span style={{ paddingRight: '3px' }}>{ itemIsOpen ? <IconCaretDown /> : <IconCaretRight />}</span> : null}
              {item.text}
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
      <div style={{ height: '100%', overflow: 'auto', padding: '10px' }}>
        {menuItems ? this.renderMenuItems(menuItems[0].childItems, true) : undefined}
      </div>
    );
  }
}

CollapsingNavigationMenu.propTypes = propTypes;
CollapsingNavigationMenu.defaultProps = defaultProps;

export default CollapsingNavigationMenu;
