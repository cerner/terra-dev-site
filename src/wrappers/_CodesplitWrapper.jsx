import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import ContentErrorBoundary from './_ContentErrorBoundary';

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

  /**
   * Loading indicator to be displayed while loading
   */
  fallback: PropTypes.element.isRequired,

  /**
   * Component to wrap around loaded content
   */
  loadedWrapper: PropTypes.func,

  /**
   * Component to wrap around errored content
   */
  errorWrapper: PropTypes.func.isRequired,
};

const defaultProps = {
  props: undefined,
};

const CodesplitWrapper = ({
  content: Content, props, loadedWrapper: LoadedWrapper, errorWrapper, fallback,
}) => (
  <ContentErrorBoundary errorWrapper={errorWrapper}>
    <Suspense fallback={fallback}>
      {LoadedWrapper ? (
        <LoadedWrapper>
          <Content {...props} />
        </LoadedWrapper>
      ) : (
        <Content {...props} />
      )}
    </Suspense>
  </ContentErrorBoundary>
);

CodesplitWrapper.propTypes = propTypes;
CodesplitWrapper.defaultProps = defaultProps;

export default CodesplitWrapper;
