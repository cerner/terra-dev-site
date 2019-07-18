import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TerraMarkdown from 'terra-markdown';
import classNames from 'classnames/bind';
import ContentLoaded from './_ContentLoaded';
import ContentLoading from './_ContentLoading';

import styles from './Markdown.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The content to be placed within the main content area of the container.
   */
  content: PropTypes.func,
};

const defaultProps = {
  content: undefined,
};

const MarkdownWrapper = ({ content }) => {
  const [state, setState] = useState({
    markdown: undefined,
    isErrored: false,
  });
  const { markdown, isErrored } = state;

  // Dynamically import Javascript chunk
  useEffect(() => {
    let isActive = true;
    if (!markdown && !isErrored) {
      content().then(({ default: markdownFile }) => {
        if (isActive) {
          setState({
            markdown: markdownFile,
            isErrored: false,
          });
        }
      }).catch(() => {
        if (isActive) {
          setState({
            markdown: undefined,
            isErrored: true,
          });
        }
      });
    }
    return () => { isActive = false; };
  });

  if (markdown || isErrored) {
    return (
      <ContentLoaded>
        { markdown ? <div className={cx('markdown')}><TerraMarkdown src={markdown} /></div> : 'The page failed to load. Refresh the page to try again.' }
      </ContentLoaded>
    );
  }

  return <ContentLoading />;
};

MarkdownWrapper.propTypes = propTypes;
MarkdownWrapper.defaultProps = defaultProps;

export default MarkdownWrapper;
