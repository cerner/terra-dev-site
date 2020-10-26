import React, { Suspense } from 'react';
import ApplicationPage from '@cerner/terra-application/lib/application-page/ApplicationPage';
import classNames from 'classnames/bind';
import { ThemeContext } from '@cerner/terra-application/lib/theme';

import PageErrorBoundary from './_DevSitePageErrorBoundary';
import LoadingPage from '../static-pages/_LoadingPage';
import ContentLoadedContainer from './_ContentLoaded';
import styles from './DevSitePage.module.scss';

const cx = classNames.bind(styles);

const DevSitePage = ({pageContentConfig, contentComponent: ContentComponent}) => {
  const theme = React.useContext(ThemeContext);
  return (
    <ApplicationPage
      title={pageContentConfig.text}
    >
      <PageErrorBoundary>
        <Suspense fallback={(
          <LoadingPage />
        )}
        >
          <ContentLoadedContainer className={cx(...(pageContentConfig.type === 'md' || pageContentConfig.type === 'mdx' ? ['markdown'] : []))}>
            <ContentComponent />
          </ContentLoadedContainer>
        </Suspense>
      </PageErrorBoundary>
    </ApplicationPage>
  );
};

export default DevSitePage;
