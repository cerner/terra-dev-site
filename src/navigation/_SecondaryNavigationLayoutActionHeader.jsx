import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import ButtonGroup from 'terra-button-group';
import IconLeftPane from 'terra-icon/lib/icon/IconLeftPane';
import CollapsibleMenuView from 'terra-collapsible-menu-view';

import styles from './SecondaryNavigationLayoutActionHeader.module.scss';

const cx = classNames.bind(styles);

const menuPropTypes = {
  selectedTheme: PropTypes.string,
  selectedLocale: PropTypes.string,
  config: PropTypes.shape({
    themes: PropTypes.arrayOf(PropTypes.string),
    selectedTheme: PropTypes.string,
    locales: PropTypes.arrayOf(PropTypes.string),
    selectedLocale: PropTypes.string,
    directions: PropTypes.arrayOf(PropTypes.string),
    selectedDirection: PropTypes.string,
  }),
  onChangeLocale: PropTypes.func,
  onChangeTheme: PropTypes.func,
};

const menuDefaultProps = {
  selectedTheme: undefined,
  selectedLocale: undefined,
  config: undefined,
  onChangeLocale: undefined,
  onChangeTheme: undefined,
};

const SettingsMenu = ({
  config,
  selectedTheme,
  selectedLocale,
  onChangeTheme,
  onChangeLocale,
}) => {
  const hasThemes = config.themes.length > 1;
  const hasLocales = config.locales.length > 1;

  if (!hasThemes && !hasLocales) {
    return null;
  }

  // 'undefined' added to work around bug
  const items = [undefined];

  if (hasThemes) {
    items.push(
      <CollapsibleMenuView.ItemGroup
        key="Theme"
        selectedKeys={[selectedTheme]}
        onChange={(event, key) => onChangeTheme(key)}
      >
        {config.themes.map(theme => (
          <CollapsibleMenuView.Item
            text={theme}
            key={theme}
            isSelected={selectedTheme === theme}
          />
        ))}
      </CollapsibleMenuView.ItemGroup>,
    );
  }

  if (hasThemes && hasLocales) {
    items.push(<CollapsibleMenuView.Divider key="a house divided" />);
  }

  if (hasLocales) {
    items.push(
      <CollapsibleMenuView.ItemGroup
        key="locale"
        selectedKeys={[selectedLocale]}
        onChange={(event, key) => onChangeLocale(key)}
      >
        {config.locales.map(locale => (
          <CollapsibleMenuView.Item
            text={locale}
            key={locale}
            isSelected={selectedLocale === locale}
          />
        ))}
      </CollapsibleMenuView.ItemGroup>,
    );
  }

  return (
    <CollapsibleMenuView className={cx('flex-collapse')} key="menu">
      {items}
    </CollapsibleMenuView>
  );
};

SettingsMenu.propTypes = menuPropTypes;
SettingsMenu.defaultProps = menuDefaultProps;

const propTypes = {
  onToggle: PropTypes.func,
  menuIsVisible: PropTypes.bool,
};

const defaultProps = {
  onToggle: undefined,
  menuIsVisible: true,
};

const SecondaryNavigationLayoutActionHeader = ({
  onToggle,
  menuIsVisible,
  ...menuProps
}) => (
  <div className={cx('header')}>
    <div className={cx('toggle')}>
      <ButtonGroup
        selectedKeys={menuIsVisible ? ['close-menu'] : undefined}
      >
        <ButtonGroup.Button
          icon={<IconLeftPane />}
          key={menuIsVisible ? 'close-menu' : 'open-menu'}
          text={menuIsVisible ? 'Close Menu' : 'Open Menu'}
          onClick={onToggle}
        />
      </ButtonGroup>
    </div>
    <SettingsMenu {...menuProps} />
  </div>
);

SecondaryNavigationLayoutActionHeader.propTypes = propTypes;
SecondaryNavigationLayoutActionHeader.defaultProps = defaultProps;

export default SecondaryNavigationLayoutActionHeader;
