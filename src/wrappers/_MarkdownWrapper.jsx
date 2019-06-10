import React from 'react';
import PropTypes from 'prop-types';
import TerraMarkdown from 'terra-markdown';
import classNames from 'classnames/bind';

import DynamicImportWrapper from './_DynamicImportWrapper';
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

const MarkdownWrapper = ({ content }) => (
  <DynamicImportWrapper
    content={content}
    render={markdown => <div className={cx('markdown')}><TerraMarkdown src={markdown} /></div>}
  />
);

MarkdownWrapper.propTypes = propTypes;
MarkdownWrapper.defaultProps = defaultProps;

export default MarkdownWrapper;
