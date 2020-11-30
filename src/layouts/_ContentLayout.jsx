import React, { Suspense } from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { ApplicationStatusOverlayProvider } from '@cerner/terra-application/lib/application-status-overlay';
import { ApplicationLoadingOverlayProvider } from '@cerner/terra-application/lib/application-loading-overlay';
import MainContainer from '@cerner/terra-application/lib/main-container';
import ContentErrorBoundary from '../content/_ContentErrorBoundary';
import LoadingOverlay from '../content/_LoadingOverlay';
import NotFoundOverlay from '../content/_NotFoundOverlay';
import ContentLoadedContainer from '../content/_ContentLoaded';
import { contentImportsShape, pageContentConfigShape } from '../site/siteConfigShapes';

const propTypes = {
  /**
   * Config describing the page
   */
  pageContentConfig: pageContentConfigShape.isRequired,

  /**
   * Function called to request closing the modal
   */
  contentImports: contentImportsShape.isRequired,
};

const ContentLayout = ({ pageContentConfig, contentImports }) => {
  const location = useLocation();
  const isRaw = useRouteMatch('/raw');
  const pathname = isRaw ? location.pathname.substring(4) : location.pathname;
  const ContentComponent = contentImports[pathname];

  return (
    <ApplicationLoadingOverlayProvider>
      <ApplicationStatusOverlayProvider>
        <MainContainer>
          {
            pageContentConfig
              ? (
                <ContentErrorBoundary>
                  <Suspense fallback={(
                    <LoadingOverlay />
                  )}
                  >
                    <ContentLoadedContainer type={pageContentConfig.type}>
                      <ContentComponent />
                    </ContentLoadedContainer>
                  </Suspense>
                </ContentErrorBoundary>
              )
              : <NotFoundOverlay />
          }
        </MainContainer>
      </ApplicationStatusOverlayProvider>
    </ApplicationLoadingOverlayProvider>
  );
};

ContentLayout.propTypes = propTypes;

export default ContentLayout;
