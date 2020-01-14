import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import AppSettingsContext from './_AppSettingsContext';
import { settingsConfigPropType } from '../site/siteConfigPropTypes';

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
  const [state, setState] = useState({
    locale: defaultLocale,
    theme: defaultTheme,
    themeName: themes[defaultTheme],
    direction: defaultDirection,
  });

  /**
   * Handle setting update and store new settings in state.
   * @param {*} newSettings
   */
  const onUpdate = ({ locale, theme, direction }) => {
    const newState = {};
    if (locale) {
      newState.locale = locale;
    }

    if (theme) {
      newState.theme = theme;
      newState.themeName = themes[theme];
    }

    if (direction) {
      newState.direction = direction;
    }

    if (Object.keys(newState).length) {
      setState(newState);
    }
  };

  /**
   * Place settings on dom
   */
  useEffect(() => {
    const htmlNode = document.getElementsByTagName('html')[0];

    if (htmlNode.getAttribute('lang') !== state.locale) {
      htmlNode.setAttribute('lang', state.locale);
    }

    if (htmlNode.getAttribute('dir') !== state.direction) {
      htmlNode.setAttribute('dir', state.direction);
    }
  }, [state.locale, state.direction]);

  return (
    <AppSettingsContext.Provider value={{ ...settingsConfig, state, onUpdate }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

AppSettingsProvider.propTypes = propTypes;

export default AppSettingsProvider;
