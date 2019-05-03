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
  title: PropTypes.string,
  content: PropTypes.node,
};

const SecondaryNavigationLayoutActionHeader = ({
  onToggle, menuIsVisible, title, content,
}) => (
  <div className={cx('header')}>
    <div className={cx('toggle')}>
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
    </div>
    <div className={cx('title-container')}>
      <div className={cx('title')} title={title}>
        {title}
      </div>
    </div>
    <div className={cx('content')}>{content}</div>
  </div>
);

SecondaryNavigationLayoutActionHeader.propTypes = propTypes;

export default SecondaryNavigationLayoutActionHeader;
