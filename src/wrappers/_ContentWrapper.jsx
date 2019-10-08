import React from 'react';
import PropTypes from 'prop-types';

import CodesplitWrapper from './_CodesplitWrapper';
import ContentLoaded from './_ContentLoaded';
import ContentLoading from './_ContentLoading';

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
  <CodesplitWrapper
    {...props}
    fallback={<ContentLoading />}
    loadedWrapper={ContentLoaded}
    errorWrapper={ContentLoaded}
  />
);

ContentWrapper.propTypes = propTypes;
ContentWrapper.defaultProps = defaultProps;

export default ContentWrapper;
