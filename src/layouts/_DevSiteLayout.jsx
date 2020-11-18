import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import DevSiteNavigationLayout from './_DevSiteNavigationLayout';
import RawLayout from './_RawLayout';
import siteConfigShape from '../site/siteConfigShapes';

const propTypes = {
  /**
   * The site config for the application.
   */
  siteConfig: siteConfigShape.isRequired,
};

const DevSiteLayout = ({ siteConfig }) => {
  const isRaw = useRouteMatch('/raw');

  if (isRaw) {
    return <RawLayout siteConfig={siteConfig} />;
  }
  return <DevSiteNavigationLayout siteConfig={siteConfig} />;
};

DevSiteLayout.propTypes = propTypes;

export default DevSiteLayout;
