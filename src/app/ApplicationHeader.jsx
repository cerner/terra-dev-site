import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import IconSettings from 'terra-icon/lib/icon/IconSettings';
import Header from 'terra-application-header-layout';

import HeaderUtility from './common/header-templates/Utility';
import Logo from './common/header-templates/Logo';
import NavTabs from './common/nav-tabs/NavTabs';
import Toggle from './ApplicationToggle';
import styles from './ApplicationHeader.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The layoutConfig instance provided by terra-layout.
   */
  layoutConfig: PropTypes.object,
  /**
   * The navigaion links to display within the toolbar.
   */
  navigation: PropTypes.object,
  /**
   * The title branding of the site.
   */
  title: PropTypes.string,
  /**
   * Logo element to be placed at the start of the toolbar.
   * */
  logo: PropTypes.element,
  /**
   * The current site locale.
   */
  locale: PropTypes.string,
  /**
   * The locale options the site should display in the locale utility in the toobar.
   */
  locales: PropTypes.array,
  /**
   * A callback event that will be triggered when the locale utility changes.
   */
  onLocaleChange: PropTypes.func,
  /**
   * Whether or not to display the directionality utility in the toolbar.
   */
  hideBidiUtility: PropTypes.bool,
  /**
   * The current site directionality.
   */
  dir: PropTypes.string,
  /**
   * A callback event that will be triggered when the directionality utility changes.
   */
  onDirChange: PropTypes.func,
  /**
   * The current site theme.
   */
  theme: PropTypes.string,
  /**
   * The theme options the site should display in the locale utility in the toobar.
   */
  themes: PropTypes.array,
  /**
   * A callback event that will be triggered when the theme utility changes.
   */
  onThemeChange: PropTypes.func,
};

const defaultProps = {
  layoutConfig: undefined,
  navigation: undefined,
  title: null,
  logo: null,
  locale: null,
  locales: null,
  onLocaleChange: undefined,
  hideBidiUtility: false,
  dir: null,
  onDirChange: undefined,
  theme: null,
  themes: undefined,
  onThemeChange: undefined,
};

class ApplicationHeader extends React.Component {
  render() {
    const isCompactHeader = (this.props.layoutConfig.size === 'tiny' || this.props.layoutConfig.size === 'small');
    const menuItems = [];

    function supportsCSSVars() {
      return window.CSS && window.CSS.supports && window.CSS.supports('(--fake-var: 0)');
    }

    if (this.props.themes && this.props.themes.length > 1 && supportsCSSVars()) {
      menuItems.push(
        <HeaderUtility.Item
          text={`Theme: ${this.props.theme}`}
          key="theme-utility"
          subMenuItems={[
            <HeaderUtility.ItemGroup isSelectable key="theme-options" dir={this.props.dir} onChange={this.props.onThemeChange} >
              {this.props.themes.map(themeName => (
                <HeaderUtility.Item id={themeName} text={themeName} key={themeName} isSelected={this.props.theme === themeName} />
              ))}
            </HeaderUtility.ItemGroup>,
          ]}
        />,
      );
    }

    if (this.props.locales && this.props.locales.length > 1) {
      menuItems.push(
        <HeaderUtility.Item
          text={`Locale: ${this.props.locale}`}
          key="locale-utility"
          subMenuItems={[
            <HeaderUtility.ItemGroup isSelectable key="local-options" dir={this.props.dir} onChange={this.props.onLocaleChange} >
              {this.props.locales.map(localeName => (
                <HeaderUtility.Item id={localeName} text={localeName} key={localeName} isSelected={this.props.locale === localeName} />
              ))}
            </HeaderUtility.ItemGroup>,
          ]}
        />,
      );
    }

    if (!this.props.hideBidiUtility) {
      menuItems.push(
        <HeaderUtility.Divider key="utility-divider" />,
        <HeaderUtility.ItemGroup isSelectable key="bidi-utility" dir={this.props.dir} size="medium" onChange={this.props.onDirChange}>
          <HeaderUtility.Item id="ltr" text="ltr" key="ltr" isSelected={this.props.dir === 'ltr'} />
          <HeaderUtility.Item id="rtl" text="rtl" key="rtl" isSelected={this.props.dir === 'rtl'} />
        </HeaderUtility.ItemGroup>,
      );
    }

    let utility;
    if (menuItems.length > 0) {
      utility = (
        <HeaderUtility
          accessory={<IconSettings />}
          title="Config"
          menuItems={menuItems}
        />
      );
    }

    let navTabs;
    if (this.props.navigation && !isCompactHeader) {
      navTabs = <NavTabs links={this.props.navigation.links} />;
    }

    return (
      <Header
        className={cx(['header'])}
        logo={(
          <Logo
            title={this.props.title}
            accessory={this.props.logo}
            size={this.props.layoutConfig.size}
          />
        )}
        utilities={utility}
        navigation={navTabs}
        extensions={this.props.navigation && this.props.navigation.extensions}
        toggle={<Toggle layoutConfig={this.props.layoutConfig} />}
      />
    );
  }
}

ApplicationHeader.propTypes = propTypes;
ApplicationHeader.defaultProps = defaultProps;

export default ApplicationHeader;
