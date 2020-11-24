import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ApplicationBase from '@cerner/terra-application';

import DevSiteLayout from '../layouts/_DevSiteLayout';
import AppSettingsContext from './_AppSettingsContext';
import AppSettingsProvider from './_AppSettingsProvider';
import siteConfigShape from './siteConfigShapes';
import TerraMdxProvider from '../mdx/_TerraMdxProvider';
import Router from './_DevSiteRouter';
import DevSiteApplicationContainer from './_DevSiteApplicationContainer';

const propTypes = {
  /**
   * The site config for the application.
   */
  siteConfig: siteConfigShape.isRequired,
  /**
   * The component representing the providers layer of terra-dev-site. Must render children.
   */
  Providers: PropTypes.func,
};

const Site = ({ siteConfig, Providers }) => (
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
                  {Providers ? (
                    <Providers>
                      <DevSiteLayout siteConfig={siteConfig} />
                    </Providers>
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
