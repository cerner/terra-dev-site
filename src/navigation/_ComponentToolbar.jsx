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
  devToolbarConfig: PropTypes.shape({
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
  devToolbarConfig,
}) => {
  const hasThemes = devToolbarConfig && devToolbarConfig.themes && devToolbarConfig.themes.length > 1;
  const hasLocales = devToolbarConfig && devToolbarConfig.locales && devToolbarConfig.locales.length > 1;

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
            items={devToolbarConfig.themes}
            selectedKey={devToolbarConfig.selectedTheme}
            onChange={devToolbarConfig.onChangeTheme}
          />
        )}
        {hasLocales && (
          <MenuButton
            text="Locale"
            items={devToolbarConfig.locales}
            selectedKey={devToolbarConfig.selectedLocale}
            onChange={devToolbarConfig.onChangeLocale}
          />
        )}
      </div>
    </div>
  );
};

ComponentToolbar.propTypes = propTypes;
ComponentToolbar.defaultProps = defaultProps;

export default ComponentToolbar;
