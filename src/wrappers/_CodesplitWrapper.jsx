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

  fallback: PropTypes.element.isRequired,

  contentWrapper: PropTypes.element,

  errorWrapper: PropTypes.element,
};

const defaultProps = {
  props: undefined,
};

const ExtensionWrapper = ({
  content: Content, props, contentWrapper: ContentWrapper, errorWrapper, fallback,
}) => (
  <ContentErrorBoundary errorWrapper={errorWrapper}>
    <Suspense fallback={fallback}>
      {ContentWrapper ? (
        <contentWrapper>
          <Content {...props} />
        </contentWrapper>
      ) : (
        <Content {...props} />
      )
      }
    </Suspense>
  </ContentErrorBoundary>
);

ExtensionWrapper.propTypes = propTypes;
ExtensionWrapper.defaultProps = defaultProps;

export default ExtensionWrapper;
