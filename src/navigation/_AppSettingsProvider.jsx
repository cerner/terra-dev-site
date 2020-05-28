import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import AppSettingsContext from './_AppSettingsContext';
import { settingsConfigPropType } from '../site/siteConfigPropTypes';
/* global TERRA_AGGREGATED_LOCALES */

const propTypes = {
  children: PropTypes.element.isRequired,
  settingsConfig: settingsConfigPropType.isRequired,
};

const AppSettingsProvider = ({ settingsConfig, children }) => {
  const {
    defaultLocale = 'en',
    defaultTheme,
    defaultDirection = 'ltr',
    themes,
  } = settingsConfig;

  // Use default locales or fall back on user configurations
  const locales = typeof TERRA_AGGREGATED_LOCALES === 'object' ? TERRA_AGGREGATED_LOCALES : settingsConfig.locales;

  const [currentLocale, setCurrentLocale] = useState(defaultLocale);
  const [currentDirection, setCurrentDirection] = useState(defaultDirection);
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  /**
   * Place settings on dom
   */
  useEffect(() => {
    const htmlNode = document.getElementsByTagName('html')[0];

    if (htmlNode.getAttribute('lang') !== currentLocale) {
      htmlNode.setAttribute('lang', currentLocale);
    }

    if (htmlNode.getAttribute('dir') !== currentDirection) {
      htmlNode.setAttribute('dir', currentDirection);
    }
  }, [currentLocale, currentDirection]);

  const appSettings = useMemo(() => {
    /**
     * Handle setting update and store new settings in state.
     * @param {*} newSettings
     */
    const onUpdate = ({ locale, theme, direction }) => {
      if (locale) {
        setCurrentLocale(locale);
      }

      if (theme) {
        setCurrentTheme(theme);
      }

      if (direction) {
        setCurrentDirection(direction);
      }
    };

    return ({
      ...settingsConfig,
      locales,
      currentLocale,
      currentTheme,
      currentDirection,
      currentThemeName: themes[currentTheme],
      onUpdate,
    });
  }, [settingsConfig, locales, themes, currentLocale, currentTheme, currentDirection]);

  return (
    <AppSettingsContext.Provider value={appSettings}>
      {children}
    </AppSettingsContext.Provider>
  );
};

AppSettingsProvider.propTypes = propTypes;

export default AppSettingsProvider;
