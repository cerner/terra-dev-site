import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'terra-markdown';
import classNames from 'classnames/bind';
import styles from './MarkdownWrapper.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The markdown to display.
   */
  src: PropTypes.string,
};

const defaultProps = {
  src: '',
};

const MarkdownWrapper = ({ src }) => {
  const MarkdownWrapperClassNames = cx([
    'markdown-wrapper',
  ]);

  return (
    <div className={MarkdownWrapperClassNames}>
      <Markdown src={src} />
    </div>
  );
};

MarkdownWrapper.propTypes = propTypes;
MarkdownWrapper.defaultProps = defaultProps;

export default MarkdownWrapper;
