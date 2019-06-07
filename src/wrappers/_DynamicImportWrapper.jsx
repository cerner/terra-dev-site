import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './ContentWrapper.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The content to be placed within the main content area of the container.
   */
  content: PropTypes.func.isRequired,
  /**
   * The props to be applied to the content.
   */
  render: PropTypes.func.isRequired,
};

const DynamicImportWrapper = ({ content, render }) => {
  const [state, setState] = useState({
    Content: undefined,
    isErrored: false,
  });
  const { Content, isErrored } = state;

  useEffect(() => {
    let isSubscribed = true;
    if (!Content && !isErrored) {
      content().then(({ default: ContentFile }) => {
        if (isSubscribed) {
          setState({
            Content: ContentFile,
            isErrored: false,
          });
        }
      }).catch(() => {
        if (isSubscribed) {
          setState({
            Content: undefined,
            isErrored: true,
          });
        }
      });
    }
    return () => { isSubscribed = false; };
  });

  if (Content) {
    return (
      <div
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
