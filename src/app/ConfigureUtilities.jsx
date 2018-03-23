import React from 'react';
import IconSettings from 'terra-icon/lib/icon/IconSettings';

function generateThemeConfig(defaultTheme, themes) {
  const childKeys = {};
  Object.keys(themes).forEach((key) => {
    childKeys[key] = {
      key,
      title: key,
      isSelected: defaultTheme === key,
      isSelectable: true,
    };
  });

  return {
    key: 'Theme',
    title: `Theme: ${defaultTheme}`,
    childKeys,
  };
}

function generateLocaleConfig(defaultlocale, locales) {
  const childKeys = {};
  locales.forEach((locale) => {
    childKeys[locale] = {
      key: locale,
      title: locale,
      isSelected: defaultlocale === locale,
      isSelectable: true,
    };
  });

  return {
    key: 'Locale',
    title: `Locale: ${defaultlocale}`,
    childKeys,
  };
}

function generateBidiConfig(defaultDir) {
  console.log('defaultDir', defaultDir);
  const dirs = ['ltr', 'rtl'];
  const childKeys = {};
  dirs.forEach((dir) => {
    childKeys[dir] = {
      key: dir,
      title: dir,
      isSelected: defaultDir === dir,
      isSelectable: true,
    };
  });

  return {
    key: 'Bidi',
    title: `Bidi: ${defaultDir}`,
    childKeys,
  };
}

function convertMenuItemToArray(menuItem) {
  const updatedItem = Object.assign({}, menuItem);
  let menuItems = [];
  if (updatedItem.childKeys) {
    menuItems = menuItems.concat(Object.keys(updatedItem.childKeys).reduce((acc, item) => acc.concat(convertMenuItemToArray(updatedItem.childKeys[item])), []));
    updatedItem.childKeys = Object.keys(updatedItem.childKeys);
  }
  menuItems.push(updatedItem);
  return menuItems;
}

function updateMetaData(parentMenuItem, metaData) {
  if (parentMenuItem && metaData) {
    Object.keys(parentMenuItem.childKeys).forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      parentMenuItem.childKeys[item].metaData = metaData;
    });
  }
}

function updateSelectedItem(parentMenuItem, selectedItem) {
  if (parentMenuItem && selectedItem) {
    // eslint-disable-next-line no-param-reassign
    parentMenuItem.title = `${parentMenuItem.key}: ${selectedItem}`;
    Object.keys(parentMenuItem.childKeys).forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      parentMenuItem.childKeys[item].isSelected = item === selectedItem;
    });
  }
}

class ConfigureUtilties {

  static generateInitialUtiltiesConfig(appConfig) {
    // console.log('app config', appConfig);
    const hasThemes = appConfig.themes && appConfig.themes.length > 0;
    const hasLocals = appConfig.locales && appConfig.locales.length > 0;

    if (!(hasThemes || hasLocals || appConfig.bidirectional)) {
      return undefined;
    }

    const rootMenuChildKeys = {};

    if (hasThemes) {
      rootMenuChildKeys.Theme = generateThemeConfig(appConfig.defaultTheme, appConfig.themes);
    }

    if (hasLocals) {
      rootMenuChildKeys.Locale = generateLocaleConfig(appConfig.defaultLocale, appConfig.locales);
    }

    if (appConfig.bidirectional) {
      rootMenuChildKeys.Bidi = generateBidiConfig(appConfig.defaultDir);
    }

    return {
      accessory: <IconSettings />,
      menuItems: {
        key: 'menu',
        title: 'Config',
        childKeys: rootMenuChildKeys,
      },
      initialSelectedKey: 'menu',
    };
  }

  static convertChildkeysToArray(config) {
    const updatedConfig = Object.assign({}, config);
    updatedConfig.menuItems = convertMenuItemToArray(updatedConfig.menuItems);
    return updatedConfig;
  }

  static addCallbackFunctions(config, onChange, metaData = {}) {
    const updatedConfig = Object.assign({}, config);
    updatedConfig.onChange = onChange;
    updateMetaData(updatedConfig.menuItems.childKeys.Theme, metaData.Theme);
    updateMetaData(updatedConfig.menuItems.childKeys.Locale, metaData.Locale);
    updateMetaData(updatedConfig.menuItems.childKeys.Bidi, metaData.Bidi);
    return updatedConfig;
  }

  static updateSelectedItems(config, theme, locale, dir) {
    const updatedConfig = Object.assign({}, config);
    updateSelectedItem(updatedConfig.menuItems.childKeys.Theme, theme);
    updateSelectedItem(updatedConfig.menuItems.childKeys.Locale, locale);
    updateSelectedItem(updatedConfig.menuItems.childKeys.Bidi, dir);

    return updatedConfig;
  }
}
export default ConfigureUtilties;
