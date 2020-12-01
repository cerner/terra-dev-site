import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useRouteMatch } from 'react-router-dom';
import ContentErrorBoundary from './_ContentErrorBoundary';
import LoadingOverlay from './_LoadingOverlay';
import ContentLoadedContainer from './_ContentLoaded';
import { contentImportsShape, pageContentConfigShape } from '../site/siteConfigShapes';
import NotFoundOverlay from './_NotFoundOverlay';

const propTypes = {
  /**
   * Config describing the page
   */
  pageContentConfig: pageContentConfigShape.isRequired,

  /**
   * Function called to request closing the modal
   */
  contentImports: contentImportsShape.isRequired,

  /**
  * The component representing the providers layer of terra-dev-site. Must render children.
  */
  ContentWrapper: PropTypes.func,
};

const ContentLayout = ({ pageContentConfig, contentImports, ContentWrapper }) => {
  const location = useLocation();
  const isRaw = useRouteMatch('/raw');
  const pathname = isRaw ? location.pathname.substring(4) : location.pathname;
  const ContentComponent = contentImports[pathname];

  if (!pageContentConfig) {
    return <NotFoundOverlay />;
  }

  const contentContainer = (
    <ContentLoadedContainer type={pageContentConfig.type} isScrollContainer={isRaw}>
      <ContentComponent />
    </ContentLoadedContainer>
  );

  return (
    <ContentErrorBoundary>
      <Suspense fallback={(
        <LoadingOverlay />
      )}
      >
        {
          ContentWrapper
            ? (
              <ContentWrapper>
                {contentContainer}
              </ContentWrapper>
            )
            : contentContainer
        }
      </Suspense>
    </ContentErrorBoundary>
  );
};

ContentLayout.propTypes = propTypes;

export default ContentLayout;
