import React from 'react';
import PropTypes from 'prop-types';
import TerraDocTemplate from 'terra-doc-template';

import DynamicImportWrapper from './_DynamicImportWrapper';

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
    render={markdown => <TerraDocTemplate readme={markdown} />}
  />
);

MarkdownWrapper.propTypes = propTypes;
MarkdownWrapper.defaultProps = defaultProps;

export default MarkdownWrapper;
