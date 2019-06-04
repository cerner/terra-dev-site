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

  // build out the menu items for themes, locals, and bidi.
  const config = {
    defaultTheme: appConfig.defaultTheme,
    themes: appConfig.themes || {},
    defaultLocale: appConfig.defaultLocale,
    locales: appConfig.locales || {},
    defaultDirection: appConfig.defaultDir,
    directions: ['ltr', 'rtl'],
  };

  return {
    config,
    imports: utilsImports,
  };
};

module.exports = generateUtilitiesConfig;
