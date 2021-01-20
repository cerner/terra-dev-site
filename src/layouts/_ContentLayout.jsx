import React from 'react';
import { useLocation } from 'react-router-dom';
import { ApplicationLoadingOverlayProvider } from '@cerner/terra-application/lib/application-loading-overlay';
import MainContainer from '@cerner/terra-application/lib/main-container';
import Suspense from '@cerner/terra-application/lib/shared/Suspense';
import classNamesBind from 'classnames/bind';
import ContentLoadedContainer from '../content/_ContentLoaded';
import { contentImportsShape, pageContentConfigShape } from '../site/siteConfigShapes';

import styles from './ContentLayout.module.scss';

const cx = classNamesBind.bind(styles);

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
  const pathname = location.pathname.substring(4);
  const ContentComponent = contentImports[pathname];
  const [loadingFailed, setLoadingFailed] = React.useState();

  if (!pageContentConfig) {
    return <div>404</div>;
  }

  if (loadingFailed) {
    return (
      <ContentLoadedContainer type={pageContentConfig.type} isScrollContainer>
        <div>Error: chunk failed to load.</div>
      </ContentLoadedContainer>
    );
  }

  return (
    <ApplicationLoadingOverlayProvider>
      {/* <ApplicationStatusOverlayProvider> */}
        <MainContainer className={cx('main')}>
          <Suspense
            fallback={<div>loading</div>}
            onError={() => setLoadingFailed(true)}
          >
            <ContentLoadedContainer type={pageContentConfig.type} isScrollContainer>
              <ContentComponent />
            </ContentLoadedContainer>
          </Suspense>
        </MainContainer>
      {/* </ApplicationStatusOverlayProvider> */}
    </ApplicationLoadingOverlayProvider>
  );
};

ContentLayout.propTypes = propTypes;

export default ContentLayout;
