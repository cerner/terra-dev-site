import React from 'react';
import classNames from 'classnames/bind';
import Button, { ButtonVariants } from 'terra-button';
import IconLeft from 'terra-icon/lib/icon/IconLeft';

import styles from './SideNavHeader.module.scss';

const cx = classNames.bind(styles);

const propTypes = {};

const SideNavHeader = ({
  onRequestClose, label, children,
}) => (
  <div className={cx('page-header-container')}>
    <div className={cx('page-layout-header')}>
      {onRequestClose ? (
        <div className={cx('back-button-container')}>
          <Button
            className={cx(['header-button', 'back-button'])}
            icon={<IconLeft />}
            text="Back" // TODO validate icon/text and intl
            onClick={onRequestClose}
            variant={ButtonVariants.UTILITY}
          />
        </div>
      ) : null}
      <div className={cx('label-container')}>
        {label}
      </div>
    </div>
    {children}
  </div>
);

SideNavHeader.propTypes = propTypes;

export default SideNavHeader;
