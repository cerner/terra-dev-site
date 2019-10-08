import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './NpmBadge.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * component name.
   */
  name: PropTypes.string.isRequired,
  /**
   * url to link to
   */
  url: PropTypes.string,
  /**
   * The package version.
   */
  version: PropTypes.string.isRequired,
};

const NpmBadge = ({ name, url, version }) => (
  <div className={cx('badge-container')}>
    <a className={cx('badge')} href={url || `https://www.npmjs.org/package/${name}/v/${version}`}>
      <span className={cx('badge-name')}>
        {url ? 'package' : 'npm'}
      </span>
      <span className={cx('badge-version')}>
        {`v${version}`}
      </span>
    </a>
  </div>
);

NpmBadge.propTypes = propTypes;

export default NpmBadge;
