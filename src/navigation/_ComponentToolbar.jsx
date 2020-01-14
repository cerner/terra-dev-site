import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Button from 'terra-button';
import IconLeftPane from 'terra-icon/lib/icon/IconLeftPane';
import MenuButton from '../menu-button/_MenuButton';
import AppSettingsContext from './_AppSettingsContext';

import styles from './ComponentToolbar.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * Callback for showing the side menu
   */
  onToggle: PropTypes.func,

  /**
   * Menu visible external state
   */
  menuIsVisible: PropTypes.bool,
};

const defaultProps = {
  onToggle: undefined,
  menuIsVisible: false,
};

const ComponentToolbar = ({
  onToggle,
  menuIsVisible,
}) => {
  const appSettings = React.useContext(AppSettingsContext);
  const hasThemes = appSettings.themes && Object.keys(appSettings.themes).length > 1;
  const hasLocales = appSettings.locales && appSettings.locales.length > 1;

  const onChangeTheme = (theme) => (
    appSettings.onUpdate({ ...appSettings.state, theme })
  );
  const onChangeLocale = (locale) => (
    appSettings.onUpdate({ ...appSettings.state, locale })
  );

  return (
    <div className={cx('header')}>
      <div className={cx('toggle')}>
        { onToggle ? (
          <Button
            id="terra-dev-site-menu-toggle"
            text={menuIsVisible ? 'Close Menu' : 'Open Menu'}
            key={menuIsVisible ? 'close-menu' : 'open-menu'}
            icon={<IconLeftPane />}
            variant="ghost"
            isIconOnly
            onClick={onToggle}
          />
        )
          : null}
      </div>
      <div className={cx('flex-collapse')}>
        {hasThemes && (
          <MenuButton
            text="Theme"
            items={Object.keys(appSettings.themes)}
            selectedKey={appSettings.state.theme}
            onChange={onChangeTheme}
          />
        )}
        {hasLocales && (
          <MenuButton
            text="Locale"
            items={appSettings.locales}
            selectedKey={appSettings.state.locale}
            onChange={onChangeLocale}
          />
        )}
      </div>
    </div>
  );
};

ComponentToolbar.propTypes = propTypes;
ComponentToolbar.defaultProps = defaultProps;

export default ComponentToolbar;
