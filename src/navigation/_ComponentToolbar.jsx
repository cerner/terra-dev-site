import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import ButtonGroup from 'terra-button-group';
import IconLeftPane from 'terra-icon/lib/icon/IconLeftPane';

import styles from './SecondaryNavigationLayoutActionHeader.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  onToggle: PropTypes.func,
  menuIsVisible: PropTypes.bool,
  children: PropTypes.element,
};

const defaultProps = {
  onToggle: undefined,
  menuIsVisible: true,
};

const SecondaryNavigationLayoutActionHeader = ({
  onToggle,
  menuIsVisible,
  children,
}) => (
  <div className={cx('header')}>
    <div className={cx('toggle')}>
      { onToggle ? (
        <ButtonGroup
          selectedKeys={menuIsVisible ? ['close-menu'] : undefined}
        >
          <ButtonGroup.Button
            icon={<IconLeftPane />}
            key={menuIsVisible ? 'close-menu' : 'open-menu'}
            text={menuIsVisible ? 'Close Menu' : 'Open Menu'}
            onClick={onToggle}
          />
        </ButtonGroup>
      )
        : null
      }
    </div>
    {children}
  </div>
);

SecondaryNavigationLayoutActionHeader.propTypes = propTypes;
SecondaryNavigationLayoutActionHeader.defaultProps = defaultProps;

export default SecondaryNavigationLayoutActionHeader;
