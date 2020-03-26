import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './BadgeCommon.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * url to link to
   */
  url: PropTypes.string,
  /**
   * The package version.
   */
  version: PropTypes.string.isRequired,
};

const SrcCodeBadge = ({ url, version }) => (
  <div className={cx('badge-container')}>
    <a className={cx('badge')} href={url}>
      <span className={cx('badge-name')}>
        Source Code
      </span>
      <span className={cx('badge-version')}>
        {`v${version}`}
      </span>
    </a>
  </div>
);

SrcCodeBadge.propTypes = propTypes;

export default SrcCodeBadge;
