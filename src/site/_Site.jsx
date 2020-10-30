import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ApplicationBase from '@cerner/terra-application';
import ApplicationContainer from '@cerner/terra-application/lib/application-container/ApplicationContainer';

import DevSiteLayout from '../layouts/_DevSiteLayout';
import AppSettingsContext from './_AppSettingsContext';
import AppSettingsProvider from './_AppSettingsProvider';
import siteConfigPropType from './siteConfigPropTypes';
import TerraMdxProvider from '../mdx/_TerraMdxProvider';
import Router from './_DevSiteRouter';

const propTypes = {

  /**
   * The site config for the application.
   */
  siteConfig: siteConfigPropType.isRequired,
};

const Site = ({ siteConfig }) => (
  <AppSettingsProvider settingsConfig={siteConfig.settingsConfig}>
    <AppSettingsContext.Consumer>
      {({ currentLocale, currentThemeClassName }) => (
        <BrowserRouter basename={siteConfig.basename}>
          <Router basename={siteConfig.basename} apps={siteConfig.apps} routesMap={siteConfig.routesMap}>
            <ApplicationBase
              locale={currentLocale}
              themeName={currentThemeClassName}
            >
              <TerraMdxProvider>
                <ApplicationContainer>
                  <DevSiteLayout siteConfig={siteConfig} />
                </ApplicationContainer>
              </TerraMdxProvider>
            </ApplicationBase>
          </Router>
        </BrowserRouter>
      )}
    </AppSettingsContext.Consumer>
  </AppSettingsProvider>
);

Site.propTypes = propTypes;

export default Site;
