import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'terra-markdown';
import styles from './MarkdownWrapper.scss';

const propTypes = {
  /**
   * The markdown to display.
   */
  src: PropTypes.string,
};

const defaultProps = {
  src: '',
};

const MarkdownWrapper = ({ src }) => (
  <div className={styles.md}>
    <Markdown src={src} />
  </div>
);

MarkdownWrapper.propTypes = propTypes;
MarkdownWrapper.defaultProps = defaultProps;

export default MarkdownWrapper;
