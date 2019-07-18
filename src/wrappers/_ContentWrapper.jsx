import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import ContentErrorBoundary from './_ContentErrorBoundary';
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

const ContentWrapper = ({ content: Content, props }) => (
  <ContentErrorBoundary>
    <Suspense fallback={<ContentLoading />}>
      <ContentLoaded>
        <Content {...props} />
      </ContentLoaded>
    </Suspense>
  </ContentErrorBoundary>
);

ContentWrapper.propTypes = propTypes;
ContentWrapper.defaultProps = defaultProps;

export default ContentWrapper;
