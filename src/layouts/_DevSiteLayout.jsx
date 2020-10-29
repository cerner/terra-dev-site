import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';

import DevSiteNavigationLayout from './_DevSiteNavigationLayout';
import RawLayout from './_RawLayout';
// import siteConfigPropType from './siteConfigPropTypes';

const propTypes = {
  /**
   * The site config for the application.
   */
  // siteConfig: siteConfigPropType.isRequired,
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
