import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Button from 'terra-button';
import IconLeftPane from 'terra-icon/lib/icon/IconLeftPane';
import MenuButton from '../menu-button/_MenuButton';

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

  /**
   * Config for the theme and locale menu button.
   */
  devToolsConfig: PropTypes.shape({
    selectedTheme: PropTypes.string,
    selectedLocale: PropTypes.string,
    themes: PropTypes.arrayOf(PropTypes.string),
    locales: PropTypes.arrayOf(PropTypes.string),
    onChangeLocale: PropTypes.func,
    onChangeTheme: PropTypes.func,
  }),
};

const defaultProps = {
  onToggle: undefined,
  menuIsVisible: true,
};

const ComponentToolbar = ({
  onToggle,
  menuIsVisible,
  devToolsConfig,
}) => {
  const hasThemes = devToolsConfig && devToolsConfig.themes && devToolsConfig.themes.length > 1;
  const hasLocales = devToolsConfig && devToolsConfig.locales && devToolsConfig.locales.length > 1;

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
          : null
        }
      </div>
      <div className={cx('flex-collapse')}>
        {hasThemes && (
          <MenuButton
            text="Theme"
            items={devToolsConfig.themes}
            selectedKey={devToolsConfig.selectedTheme}
            onChange={devToolsConfig.onChangeTheme}
          />
        )}
        {hasLocales && (
          <MenuButton
            text="Locale"
            items={devToolsConfig.locales}
            selectedKey={devToolsConfig.selectedLocale}
            onChange={devToolsConfig.onChangeLocale}
          />
        )}
      </div>
    </div>
  );
};

ComponentToolbar.propTypes = propTypes;
ComponentToolbar.defaultProps = defaultProps;

export default ComponentToolbar;
