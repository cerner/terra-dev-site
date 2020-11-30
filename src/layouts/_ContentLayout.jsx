import React from 'react';
import { ApplicationStatusOverlayProvider } from '@cerner/terra-application/lib/application-status-overlay';
import { ApplicationLoadingOverlayProvider } from '@cerner/terra-application/lib/application-loading-overlay';
import MainContainer from '@cerner/terra-application/lib/main-container';
import DevSiteContent from '../content/_DevSiteContent';
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

const ContentLayout = ({ pageContentConfig, contentImports }) => (
  <ApplicationLoadingOverlayProvider>
    <ApplicationStatusOverlayProvider>
      <MainContainer>
        <DevSiteContent pageContentConfig={pageContentConfig} contentImports={contentImports} />
      </MainContainer>
    </ApplicationStatusOverlayProvider>
  </ApplicationLoadingOverlayProvider>
);

ContentLayout.propTypes = propTypes;

export default ContentLayout;
