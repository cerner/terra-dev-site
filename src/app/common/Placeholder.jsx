import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Image from 'terra-image';
import styles from './Placeholder.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The image source to display.
   */
  src: PropTypes.string,
};

const defaultProps = {
  src: undefined,
};

const Placeholder = ({ src }) => (
  <div className={cx('placeholder')}>
    <div className={cx('placeholder-content')}>
      <h3>
        {!!src && <Image variant="rounded" src={src} height="160px" width="160px" isFluid style={{ opacity: '0.2' }} />}
      </h3>
    </div>
  </div>
);

Placeholder.propTypes = propTypes;
Placeholder.defaultProps = defaultProps;

export default Placeholder;
