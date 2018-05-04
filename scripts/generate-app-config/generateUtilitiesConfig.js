const ImportAggregator = require('./generation-objects/ImportAggregator');

const generateItemConfig = (defaultItem, items, key) => {
  const childKeys = {};
  items.forEach((item) => {
    childKeys[item] = {
      key: item,
      title: item,
      isSelected: defaultItem === item,
      isSelectable: true,
    };
  });

  return {
    key,
    title: `${key}: ${defaultItem}`,
    childKeys,
  };
};

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

const generateUtiltiesConfig = (appConfig) => {
  const utilsImports = new ImportAggregator();
  utilsImports.addImport('react', 'React');

  if (appConfig === undefined) {
    return undefined;
  }
  const hasThemes = appConfig.themes && Object.keys(appConfig.themes).length > 1;
  const hasLocals = appConfig.locales && appConfig.locales.length > 1;

  if (!(hasThemes || hasLocals || appConfig.bidirectional)) {
    return undefined;
  }

  const rootMenuChildKeys = {};

  if (hasThemes) {
    rootMenuChildKeys.Theme = generateItemConfig(appConfig.defaultTheme, Object.keys(appConfig.themes), 'Theme');
  }

  if (hasLocals) {
    rootMenuChildKeys.Locale = generateItemConfig(appConfig.defaultLocale, appConfig.locales, 'Locale');
  }

  if (appConfig.bidirectional) {
    rootMenuChildKeys.Bidi = generateItemConfig(appConfig.defaultDir, ['ltr', 'rtl'], 'Bidi');
  }

  return {
    config: {
      accessory: utilsImports.addImport('terra-icon/lib/icon/IconSettings', 'IconSettings', '<IconSettings />'),
      menuItems: {
        key: 'menu',
        title: 'Config',
        childKeys: rootMenuChildKeys,
      },
      initialSelectedKey: 'menu',
      onChange: (event, { key, metaData }) => { metaData.onChange(key); },
    },
    imports: utilsImports,
  };
};
module.exports = generateUtiltiesConfig;
