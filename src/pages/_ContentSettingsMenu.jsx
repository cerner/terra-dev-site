import React from 'react';
import PropTypes from 'prop-types';
import Menu from 'terra-menu';

const propTypes = {
  /**
   * Button text
   */
  text: PropTypes.string.isRequired,

  /**
   * Menu items
   */
  items: PropTypes.arrayOf(PropTypes.string).isRequired,

  /**
   * Key for the selected menu item
   */
  selectedKey: PropTypes.string,

  /**
   * On change callback
   */
  onChange: PropTypes.func.isRequired,

  /**
   * Target element for the menu to anchor to
   */
  targetRef: PropTypes.func.isRequired,

  /**
   * Function called to request closing the menu
   */
  onRequestClose: PropTypes.func.isRequired,
};

const MenuButton = ({
  text,
  items,
  selectedKey,
  onChange,
  targetRef,
  onRequestClose,
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
