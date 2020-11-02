import React from 'react';
import classNames from 'classnames/bind';
import Button from 'terra-button';
import { useLocation, useHistory } from 'react-router-dom';

import MenuButton from '../menu-button/_MenuButton';
import AppSettingsContext from '../site/_AppSettingsContext';

import styles from './ComponentToolbar.module.scss';

const cx = classNames.bind(styles);

const ComponentToolbar = () => {
  const appSettings = React.useContext(AppSettingsContext);
  const history = useHistory();
  const location = useLocation();
  const hasThemes = appSettings.themes && appSettings.themes.length > 1;
  const hasLocales = appSettings.locales && appSettings.locales.length > 1;

  const onChangeTheme = (theme) => (
    appSettings.onUpdate({ theme })
  );
  const onChangeLocale = (locale) => (
    appSettings.onUpdate({ locale })
  );

  const onRaw = () => (
    history.push(`/raw${location.pathname}`)
  );

  return (
    <div className={cx('header')}>
      <div className={cx('flex-collapse')}>
        <Button
          id="terra-dev-site-raw"
          text="Raw"
          key="Raw"
          variant="ghost"
          onClick={onRaw}
          className={cx('button')}
        />
        {hasThemes && (
          <MenuButton
            text="Theme"
            items={appSettings.themes}
            selectedKey={appSettings.currentTheme}
            onChange={onChangeTheme}
          />
        )}
        {hasLocales && (
          <MenuButton
            text="Locale"
            items={appSettings.locales}
            selectedKey={appSettings.currentLocale}
            onChange={onChangeLocale}
          />
        )}
      </div>
    </div>
  );
};

export default ComponentToolbar;
