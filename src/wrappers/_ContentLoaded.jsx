import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './ContentLoaded.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  children: PropTypes.element.isRequired,
};

const ContentLoaded = ({ children }) => (
  <div
    id="site"
    data-terra-dev-site-content
    className={cx('dev-site-content')}
  >
    {children}
  </div>
);

ContentLoaded.propTypes = propTypes;

export default ContentLoaded;
