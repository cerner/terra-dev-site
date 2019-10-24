import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Image from 'terra-image';
import styles from './PlaceholderPage.module.scss';

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
        {!!src && <Image variant="rounded" alt="Placeholder" src={src} height="160px" width="160px" isFluid className={cx('image')} />}
      </h3>
    </div>
  </div>
);

Placeholder.propTypes = propTypes;
Placeholder.defaultProps = defaultProps;

export default Placeholder;
