import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import TerraDocTemplate from 'terra-doc-template';

import styles from './ContentWrapper.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The content to be placed within the main content area of the container.
   */
  content: PropTypes.func.isRequired,
};

const ContentWrapper = ({ content }) => {
  const [state, setState] = useState({
    markdown: undefined,
    isErrored: false,
  });

  const { markdown, isErrored } = state;

  useEffect(() => {
    let isSubscribed = true;
    if (!markdown && !isErrored) {
      content().then(({ default: mdString }) => {
        if (isSubscribed) {
          console.log('got the file?');
          setState({
            markdown: mdString,
            isErrored: false,
          });
        }
      }).catch(() => {
        if (isSubscribed) {
          setState({
            markdown: undefined,
            isErrored: true,
          });
        }
      });
    }
    return () => { isSubscribed = false; };
  });

  if (markdown) {
    return (
      <div
        data-terra-dev-site-content
        className={cx('dev-site-content')}
      >
        <TerraDocTemplate readme={markdown} />
      </div>
    );
  }

  if (isErrored) {
    console.log('is Errored');
    return (
      <div
        data-terra-dev-site-content
        className={cx('dev-site-content')}
      >
        Page failed to reload, refresh the page to try again.
      </div>
    );
  }

  return null;
};

ContentWrapper.propTypes = propTypes;

export default ContentWrapper;
