import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

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
  constructor(props) {
    super(props);

    this.renderMenuItems = this.renderMenuItems.bind(this);

    this.state = {
      openKeys: [],
    };
  }

  renderMenuItems(menuItems, firstLevel) {
    const { onSelect, selectedPath } = this.props;
    const { openKeys } = this.state;

    if (!menuItems) {
      return undefined;
    }

    return menuItems.map((item) => {
      const itemIsOpen = openKeys.indexOf(item.path) >= 0;
      const itemHasChildren = item.childItems;

      return (
        <React.Fragment key={item.path}>
          <div style={!firstLevel ? { paddingLeft: '15px' } : null}>
            <div
              className={cx(['item', { 'is-selected': selectedPath === item.path }])}
              tabIndex="0"
              role="button"
              onKeyDown={() => {

              }}
              onClick={() => {
                if (!itemHasChildren) {
                  onSelect(item.path);
                  return;
                }

                if (openKeys.indexOf(item.path) >= 0) {
                  this.setState(state => ({
                    openKeys: state.openKeys.filter(key => key !== item.path),
                  }));
                } else {
                  this.setState({
                    openKeys: openKeys.concat([item.path]),
                  });
                }
              }}
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
