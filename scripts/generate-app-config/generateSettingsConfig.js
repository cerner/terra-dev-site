const ImportAggregator = require('./generation-objects/ImportAggregator');

/**
* Build out the item config.
*/
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

  const config = {};

  // build out the menu items for themes, locals, and bidi.
  if (hasThemes) {
    config.themes = {
      default: appConfig.defaultTheme,
      values: appConfig.themes,
    };
  }

  if (hasLocals) {
    config.locales = {
      default: appConfig.defaultLocale,
      values: appConfig.locales,
    };
  }

  if (appConfig.bidirectional) {
    config.directions = {
      default: appConfig.defaultDir,
      values: ['ltr', 'rtl'],
    };
  }

  return {
    config,
    imports: utilsImports,
  };
};

module.exports = generateUtilitiesConfig;
