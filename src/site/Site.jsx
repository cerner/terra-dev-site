import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ApplicationBase from '@cerner/terra-application';

import DevSiteLayout from '../layouts/_DevSiteLayout';
import AppSettingsContext from './_AppSettingsContext';
import AppSettingsProvider from './_AppSettingsProvider';
import siteConfigPropType from './siteConfigPropTypes';
import TerraMdxProvider from '../mdx/_TerraMdxProvider';
import Router from './_DevSiteRouter';
import DevSiteApplicationContainer from './_DevSiteApplicationContainer';

const propTypes = {
  /**
   * The site config for the application.
   */
  siteConfig: siteConfigPropType.isRequired,
  /**
   * The session provider
   */
  SessionProvider: PropTypes.element,
};

const Site = ({ siteConfig, SessionProvider }) => (
  <AppSettingsProvider settingsConfig={siteConfig.settingsConfig}>
    <AppSettingsContext.Consumer>
      {({ currentLocale, currentThemeClassName }) => (
        <BrowserRouter basename={siteConfig.basename}>
          <Router sites={siteConfig.sites} routesMap={siteConfig.routesMap}>
            <ApplicationBase
              locale={currentLocale}
              themeName={currentThemeClassName}
            >
              <TerraMdxProvider>
                <DevSiteApplicationContainer titleConfig={siteConfig.titleConfig}>
                  {SessionProvider ? (
                    <SessionProvider>
                      <DevSiteLayout siteConfig={siteConfig} />
                    </SessionProvider>
                  ) : (
                    <DevSiteLayout siteConfig={siteConfig} />
                  )}
                </DevSiteApplicationContainer>
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
