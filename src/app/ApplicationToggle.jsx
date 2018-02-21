import React from 'react';
import PropTypes from 'prop-types';
import IconMenu from 'terra-icon/lib/icon/IconMenu';
import Button from 'terra-button';
import classNames from 'classnames/bind';
import styles from './ApplicationToggle.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The layoutConfig instance provided by terra-layout.
   */
  layoutConfig: PropTypes.object,
};

const defaultProps = {
  layoutConfig: undefined,
};

const ApplicationToggle = ({
  layoutConfig,
}) => {
  if (!layoutConfig.toggleMenu || (layoutConfig.size !== 'tiny' && layoutConfig.size !== 'small')) {
    return null;
  }
  return (
    <Button
      className={cx('toggle-button')}
      text="menu"
      variant="utility"
      icon={<IconMenu />}
      onClick={layoutConfig.toggleMenu}
    />
  );
};

ApplicationToggle.propTypes = propTypes;
ApplicationToggle.defaultProps = defaultProps;

export default ApplicationToggle;
