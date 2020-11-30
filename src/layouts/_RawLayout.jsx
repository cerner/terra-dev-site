import React from 'react';
import { useLocation } from 'react-router-dom';
import { HeadlessLayout } from '@cerner/terra-application/lib/layouts';
import ContentLayout from './_ContentLayout';

import siteConfigShape from '../site/siteConfigShapes';

const propTypes = {
  /**
   * The site config for the application
   */
  siteConfig: siteConfigShape.isRequired,
};

const Raw = ({ siteConfig }) => {
  const location = useLocation();
  const nonRawPath = location.pathname.substring(4);
  const pageContentConfig = siteConfig.pageConfig[nonRawPath];

  return (
    <HeadlessLayout
      renderLayout={() => (
        <ContentLayout pageContentConfig={pageContentConfig} contentImports={siteConfig.contentImports} />
      )}
    />
  );
};

Raw.propTypes = propTypes;

export default Raw;
