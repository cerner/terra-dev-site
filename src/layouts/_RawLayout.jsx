import React from 'react';
import { useLocation } from 'react-router-dom';
import { HeadlessLayout } from '@cerner/terra-application/lib/layouts';
import { PromptRegistrationContext } from '@cerner/terra-application/lib/navigation-prompt';
import NotFoundPage from '../pages/_NotFoundPage';
import DevSitePage from '../pages/_DevSitePage';

import siteConfigShape from '../site/siteConfigShapes';

const propTypes = {
  /**
   * The site config for the application
   */
  siteConfig: siteConfigShape.isRequired,
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
      <HeadlessLayout
        renderPage={() => {
          if (!pageContentConfig) {
            return <NotFoundPage />;
          }
          return <DevSitePage pageContentConfig={siteConfig.pageConfig[nonRawPath]} contentImports={siteConfig.contentImports} />;
        }}
      />
    </PromptRegistrationContext.Provider>
  );
};

Raw.propTypes = propTypes;

export default Raw;
