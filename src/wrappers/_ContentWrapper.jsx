import React from 'react';
import PropTypes from 'prop-types';

import DynamicImportWrapper from './_DynamicImportWrapper';

const propTypes = {
  /**
   * The content to be placed within the main content area of the container.
   */
  content: PropTypes.func,
  /**
   * The props to be applied to the content.
   */
  // eslint-disable-next-line react/forbid-prop-types
  props: PropTypes.object,
};

const defaultProps = {
  content: undefined,
  props: undefined,
};

const ContentWrapper = ({ content, props }) => (
  <DynamicImportWrapper
    content={content}
    render={Content => <Content {...props} />}
  />
);

ContentWrapper.propTypes = propTypes;
ContentWrapper.defaultProps = defaultProps;

export default ContentWrapper;
