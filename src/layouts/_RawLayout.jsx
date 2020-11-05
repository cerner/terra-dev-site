import React from 'react';
import { useLocation } from 'react-router-dom';
import { HeadlessLayout } from '@cerner/terra-application/lib/layouts';
import { PromptRegistrationContext } from '@cerner/terra-application/lib/navigation-prompt';
import { PageContainer } from '@cerner/terra-application/lib/page';
import NotFoundPage from '../pages/_NotFoundPage';
import DevSitePage from '../pages/_DevSitePage';

import siteConfigPropType from '../site/siteConfigPropTypes';

const propTypes = {
  /**
   * The site config for the application
   */
  siteConfig: siteConfigPropType,
};

const promptProviderValue = {
  registerPrompt: () => { },
  unregisterPrompt: () => { },
};

const Raw = ({ siteConfig }) => {
  const location = useLocation();
  const nonRawPath = location.pathname.substring(4);
  const pageContentConfig = siteConfig.pageConfig[nonRawPath];

  return (
    <PromptRegistrationContext.Provider value={promptProviderValue}>
      <PageContainer isMain>
        { pageContentConfig ? (
          <DevSitePage pageContentConfig={siteConfig.pageConfig[nonRawPath]} contentImports={siteConfig.contentImports} />
        ) : (
          <NotFoundPage />
        )}
      </PageContainer>
      {/* <HeadlessLayout
        renderPage={() => {
          if (!pageContentConfig) {
            return <NotFoundPage />;
          }
          return <DevSitePage pageContentConfig={siteConfig.pageConfig[nonRawPath]} contentImports={siteConfig.contentImports} />;
        }}
      /> */}
    </PromptRegistrationContext.Provider>
  );
};

Raw.propTypes = propTypes;

export default Raw;
