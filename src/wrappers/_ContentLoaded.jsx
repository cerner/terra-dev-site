import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './ContentLoaded.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  children: PropTypes.element.isRequired,
};

const ContentLoaded = ({ children }) => {
  useEffect(() => {
    if (!window.location || window.location.length < 2) {
      return;
    }
    const elementName = window.location.hash.slice(1);
    const element = document.getElementsByName(elementName);
    if (element[0]) {
      element[0].scrollIntoView();
    }
  });
  return (
    <div
      id="site"
      data-terra-dev-site-content
      className={cx('dev-site-content')}
    >
      {children}
    </div>
  );
};

ContentLoaded.propTypes = propTypes;

export default ContentLoaded;
