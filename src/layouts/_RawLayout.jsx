import React from 'react';
import { useLocation } from 'react-router-dom';
import { HeadlessLayout } from '@cerner/terra-application/lib/layouts';
import { ApplicationLoadingOverlayProvider } from '@cerner/terra-application/lib/application-loading-overlay';
import MainContainer from '@cerner/terra-application/lib/main-container';
import Suspense from '@cerner/terra-application/lib/shared/Suspense';
import classNamesBind from 'classnames/bind';
import ContentLoadedContainer from '../content/_ContentLoaded';

import siteConfigShape from '../site/siteConfigShapes';

import styles from './ContentLayout.module.scss';

const cx = classNamesBind.bind(styles);

const propTypes = {
  /**
   * The site config for the application
   */
  siteConfig: siteConfigShape.isRequired,
};

const Raw = ({ siteConfig }) => {
  const location = useLocation();
  const pathname = location.pathname.substring(4);
  const pageContentConfig = siteConfig.pageConfig[pathname];
  const ContentComponent = siteConfig.contentImports[pathname];
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
    <HeadlessLayout
      renderLayout={() => (
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
      )}
    />
  );
};

Raw.propTypes = propTypes;

export default Raw;
