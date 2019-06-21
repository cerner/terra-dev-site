import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Button from 'terra-button';
import IconLeftPane from 'terra-icon/lib/icon/IconLeftPane';

import styles from './ComponentToolbar.module.scss';

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

const ComponentToolbar = ({
  onToggle,
  menuIsVisible,
  children,
}) => (
  <div className={cx('header')}>
    <div className={cx('toggle')}>
      { onToggle ? (
        <Button
          text={menuIsVisible ? 'Close Menu' : 'Open Menu'}
          key={menuIsVisible ? 'close-menu' : 'open-menu'}
          icon={<IconLeftPane />}
          variant="ghost"
          isIconOnly
          onClick={onToggle}
        />
      )
        : null
      }
    </div>
    <div className={cx('flex-collapse')}>
      {children}
    </div>
  </div>
);

ComponentToolbar.propTypes = propTypes;
ComponentToolbar.defaultProps = defaultProps;

export default ComponentToolbar;
