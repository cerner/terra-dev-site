import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Menu from 'terra-menu';
import IconChevronDown from 'terra-icon/lib/icon/IconChevronDown';
import Button from 'terra-button';

import styles from './MenuButton.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  text: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedKey: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

const MenuButton = ({
  text, items, selectedKey, onChange,
}) => {
  const buttonRef = useRef(null);
  const [state, setState] = useState(false);

  return (
    <>
      <Menu
        isOpen={state}
        targetRef={() => buttonRef.current}
        onRequestClose={() => setState(false)}
      >
        <Menu.ItemGroup
          key={text}
          onChange={(event, index) => {
            setState(false);
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
      <Button
        text={text}
        className={cx('button')}
        icon={<IconChevronDown />}
        isReversed
        variant="ghost"
        refCallback={(node) => { buttonRef.current = node; }}
        onClick={() => setState(true)}
      />
    </>
  );
};

MenuButton.propTypes = propTypes;

export default MenuButton;
