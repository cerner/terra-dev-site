const path = require('path');
const lodashStartCase = require('lodash.startcase');

/**
 * Cheat. If the filename still contains a period, don't run startcase. This allows for filenames of version (v0.5.0).
 */
const startCase = (string) => {
  if (string.includes('.')) {
    return string;
  }
  return lodashStartCase(string);
};

/**
 * Gathers the complete set of requested page types.
 */
const pageTypes = primaryNavigationItems => (primaryNavigationItems.reduce((acc, primaryNavigationItem) => acc.concat([primaryNavigationItem.contentExtension]), []));

/**
 * Provides the namespace for the package in this order, mono repo package, node_modules package, provided package name.
 */
const getNamespace = (directory, namespace) => {
  const afterPackages = (/packages\/([^/]*)/.exec(directory) || {})[1];
  const afterNodeModules = (/node_modules\/([^/]*)/.exec(directory) || {})[1];

  return afterPackages || afterNodeModules || namespace;
};

/**
 * Returns an array of routes based on folder path.
 */
const getRoutes = (fileName, entryPoint) => {
  const parsedPath = path.parse(entryPoint);

  let routes = [];
  if (parsedPath.dir !== '/') {
    routes = parsedPath.dir.split('/');
  }

  // Note: splitting on separator results in the first array element to be '' so we shift to get rid of it.
  routes.shift();

  // add on the file name as the last route
  routes.push(fileName);

  return routes;
};

/**
 * Returns an object of the end most extension and the filename minus that extension.
 *
* @param {*} filePath A string representing the directory path of the file.
*/
const parseExtension = filePath => {
  const result = /\.([^.]+$)/.exec(filePath);

  let extension;
  if (result) {
    [, extension] = result;
  }
  return ({
    name: filePath.replace(/\.[^.]+$/, ''),
    extension,
  });
};

const configHelpers = {
  startCase,
  pageTypes,
  getNamespace,
  getRoutes,
  parseExtension,
};

module.exports = configHelpers;
