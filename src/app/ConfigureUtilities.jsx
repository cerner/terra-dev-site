// import React from 'react';
// import IconSettings from 'terra-icon/lib/icon/IconSettings';

// const generateItemConfig = (defaultItem, items, key) => {
//   const childKeys = {};
//   items.forEach((item) => {
//     childKeys[item] = {
//       key: item,
//       title: item,
//       isSelected: defaultItem === item,
//       isSelectable: true,
//     };
//   });

//   return {
//     key,
//     title: `${key}: ${defaultItem}`,
//     childKeys,
//   };
// };

const convertMenuItemToArray = (menuItem) => {
  const updatedItem = Object.assign({}, menuItem);
  let menuItems = [];
  if (updatedItem.childKeys) {
    menuItems = menuItems.concat(Object.keys(updatedItem.childKeys).reduce((acc, item) => acc.concat(convertMenuItemToArray(updatedItem.childKeys[item])), []));
    updatedItem.childKeys = Object.keys(updatedItem.childKeys);
  }
  menuItems.push(updatedItem);
  return menuItems;
};

const updateMetaData = (parentMenuItem, metaData) => {
  if (parentMenuItem && metaData) {
    Object.keys(parentMenuItem.childKeys).forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      parentMenuItem.childKeys[item].metaData = metaData;
    });
  }
};

const updateSelectedItem = (parentMenuItem, selectedItem) => {
  if (parentMenuItem && selectedItem) {
    // eslint-disable-next-line no-param-reassign
    parentMenuItem.title = `${parentMenuItem.key}: ${selectedItem}`;
    Object.keys(parentMenuItem.childKeys).forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      parentMenuItem.childKeys[item].isSelected = item === selectedItem;
    });
  }
};

class ConfigureUtilties {

  // static generateInitialUtiltiesConfig(appConfig) {
  //   if (appConfig === undefined) {
  //     return undefined;
  //   }
  //   const hasThemes = appConfig.themes && Object.keys(appConfig.themes).length > 1;
  //   const hasLocals = appConfig.locales && appConfig.locales.length > 1;

  //   if (!(hasThemes || hasLocals || appConfig.bidirectional)) {
  //     return undefined;
  //   }

  //   const rootMenuChildKeys = {};

  //   if (hasThemes) {
  //     rootMenuChildKeys.Theme = generateItemConfig(appConfig.defaultTheme, Object.keys(appConfig.themes), 'Theme');
  //   }

  //   if (hasLocals) {
  //     rootMenuChildKeys.Locale = generateItemConfig(appConfig.defaultLocale, appConfig.locales, 'Locale');
  //   }

  //   if (appConfig.bidirectional) {
  //     rootMenuChildKeys.Bidi = generateItemConfig(appConfig.defaultDir, ['ltr', 'rtl'], 'Bidi');
  //   }

  //   return {
  //     accessory: <IconSettings />,
  //     menuItems: {
  //       key: 'menu',
  //       title: 'Config',
  //       childKeys: rootMenuChildKeys,
  //     },
  //     initialSelectedKey: 'menu',
  //     onChange: (event, { key, metaData }) => { metaData.onChange(key); },
  //   };
  // }

  static convertChildkeysToArray(config) {
    if (config === undefined) {
      return undefined;
    }
    const updatedConfig = Object.assign({}, config);
    updatedConfig.menuItems = convertMenuItemToArray(updatedConfig.menuItems);
    return updatedConfig;
  }

  static addCallbackFunctions(config, metaData = {}) {
    if (config === undefined) {
      return undefined;
    }
    const updatedConfig = Object.assign({}, config);
    updateMetaData(updatedConfig.menuItems.childKeys.Theme, metaData.Theme);
    updateMetaData(updatedConfig.menuItems.childKeys.Locale, metaData.Locale);
    updateMetaData(updatedConfig.menuItems.childKeys.Bidi, metaData.Bidi);
    return updatedConfig;
  }

  static updateSelectedItems(config, theme, locale, dir) {
    if (config === undefined) {
      return undefined;
    }
    const updatedConfig = Object.assign({}, config);
    updateSelectedItem(updatedConfig.menuItems.childKeys.Theme, theme);
    updateSelectedItem(updatedConfig.menuItems.childKeys.Locale, locale);
    updateSelectedItem(updatedConfig.menuItems.childKeys.Bidi, dir);

    return updatedConfig;
  }
}
export default ConfigureUtilties;
