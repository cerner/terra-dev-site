import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './ContentWrapper.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The content to be loaded dynamically.
   */
  content: PropTypes.func.isRequired,
  /**
   * The render prop to handle the loaded import.
   */
  render: PropTypes.func.isRequired,
};

const DynamicImportWrapper = ({ content, render }) => {
  const [state, setState] = useState({
    Content: undefined,
    isErrored: false,
  });
  const { Content, isErrored } = state;

  // Dynamically import Javascript chunk
  useEffect(() => {
    let isActive = true;
    if (!Content && !isErrored) {
      content().then(({ default: ContentFile }) => {
        if (isActive) {
          setState({
            Content: ContentFile,
            isErrored: false,
          });
        }
      }).catch(() => {
        if (isActive) {
          setState({
            Content: undefined,
            isErrored: true,
          });
        }
      });
    }
    return () => { isActive = false; };
  });

  if (Content) {
    return (
      <div
        id="site"
        data-terra-dev-site-content
        className={cx('dev-site-content')}
      >
        { render(Content) }
      </div>
    );
  }

  if (isErrored) {
    return (
      <div
        id="site"
        data-terra-dev-site-content
        className={cx('dev-site-content')}
      >
        The page failed to load. Refresh the page to try again.
      </div>
    );
  }

  return null;
};

DynamicImportWrapper.propTypes = propTypes;

export default DynamicImportWrapper;
