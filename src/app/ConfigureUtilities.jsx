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
