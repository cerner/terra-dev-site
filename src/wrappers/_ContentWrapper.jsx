import React from 'react';
import PropTypes from 'prop-types';

import CodesplitWrapper from './_CodesplitWrapper';

const propTypes = {
  /**
   * The content to be placed within the main content area of the container.
   */
  // eslint-disable-next-line react/forbid-prop-types
  content: PropTypes.object.isRequired,
  /**
   * The props to be applied to the content.
   */
  // eslint-disable-next-line react/forbid-prop-types
  props: PropTypes.object,
};

const defaultProps = {
  props: undefined,
};

const ContentWrapper = props => (
  <CodesplitWrapper {...props} fallback={<div />} contentWrapper={ContentWrapper} errorWrapper={ContentWrapper} />
);

ContentWrapper.propTypes = propTypes;
ContentWrapper.defaultProps = defaultProps;

export default ContentWrapper;
