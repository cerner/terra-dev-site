const ImportAggregator = require('./generation-objects/ImportAggregator');

/**
* Buld out the item config.
*/
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

/**
* Build utilities config file.
*/
const generateUtilitiesConfig = (appConfig) => {
  const utilsImports = new ImportAggregator();
  // this will be a jsx file, so add react.
  utilsImports.addImport('react', 'React');

  if (!appConfig) {
    return undefined;
  }

  // no point to bulding out the menu if there are no items or just one item.
  const hasThemes = appConfig.themes && Object.keys(appConfig.themes).length > 1;
  const hasLocals = appConfig.locales && appConfig.locales.length > 1;

  if (!(hasThemes || hasLocals || appConfig.bidirectional)) {
    return undefined;
  }

  const rootMenuChildKeys = {};

  // build out the menu items for themes, locals, and bidi.
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

module.exports = generateUtilitiesConfig;
