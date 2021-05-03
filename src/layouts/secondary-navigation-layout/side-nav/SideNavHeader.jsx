import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Button, { ButtonVariants } from 'terra-button';
import IconLeft from 'terra-icon/lib/icon/IconLeft';
import { ThemeContext } from '@cerner/terra-application/lib/theme';

import styles from './SideNavHeader.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * A function called to request close of the side nav.
   */
  onRequestClose: PropTypes.function,

  /**
   * The label for the side nav header.
   */
  label: PropTypes.string,
};

const SideNavHeader = ({
  onRequestClose, label,
}) => {
  const theme = React.useContext(ThemeContext);
  return (
    <div className={cx('page-header-container', theme.className)}>
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
    </div>
  );
};

SideNavHeader.propTypes = propTypes;

export default SideNavHeader;
