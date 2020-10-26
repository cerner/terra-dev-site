import React from 'react';
import PropTypes from 'prop-types';
import Menu from 'terra-menu';

// import styles from './MenuButton.module.scss';

// const cx = classNames.bind(styles);

const propTypes = {
  /**
   * Button text
   */
  text: PropTypes.string.isRequired,

  /**
   * menu items
   */
  items: PropTypes.arrayOf(PropTypes.string).isRequired,

  /**
   * Selected menu item
   */
  selectedKey: PropTypes.string,

  /**
   * On change callback
   */
  onChange: PropTypes.func.isRequired,
};

const MenuButton = ({
  text, items, selectedKey, onChange, targetRef, onRequestClose
}) => (
  <Menu
    isOpen
    targetRef={() => targetRef}
    onRequestClose={onRequestClose}
  >
    <Menu.ItemGroup
      key={text}
      onChange={(event, index) => {
        onChange(items[index]);
      }}

    >
      {items.map(item => (
        <Menu.Item
          text={item}
          key={item}
          isSelected={selectedKey === item}
        />
      ))}
    </Menu.ItemGroup>
  </Menu>
);

MenuButton.propTypes = propTypes;

export default MenuButton;
