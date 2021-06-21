const path = require('path');
const lodashStartCase = require('lodash.startcase');
const fs = require('fs');

const monoRepoPackageCache = {};

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
const pageTypes = navConfig => (navConfig.navigation.links.reduce((acc, link) => acc.concat(link.pageTypes), []));

/**
 * Gets the path relative to the dev-site-config directory.
 */
const relativePath = componentPath => (path.relative(path.join(process.cwd(), 'dev-site-config'), componentPath));

/**
 * Provides the namespace for the package in this order, mono repo package, node_modules package, provided package name.
 */
const getNamespace = (directory, namespace) => {
// If this is a monorepo package, we need to pull the namespace from the package.json file to account for scoping.
  const packageRoot = (/.*packages\/[^/]*/.exec(directory) || {})[0];
  let afterPackages;
  if (packageRoot) {
    const packagePath = path.join(packageRoot, 'package.json');
    // cache the package name to avoid opening the files all the time.
    afterPackages = monoRepoPackageCache[packagePath];
    if (!afterPackages && fs.existsSync(packagePath)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
      afterPackages = require(packagePath).name;
      monoRepoPackageCache[packagePath] = afterPackages;
    }
  }
  // Find the directory name directly after node modules... include scoped package if they exist.
  const afterNodeModules = (/node_modules\/((@[^/]*\/)?[^/]*)/.exec(directory) || {})[1];

  return afterPackages || afterNodeModules || namespace;
};

/**
 * Returns an array of routes based on folder path.
 */
const getRoutes = (directory, type, fileName, entryPoint) => {
  // Remove the directories up to the entry point.
  const modifiedDirectory = directory.replace(entryPoint, '');

  let routes = modifiedDirectory.split('/');

  // Note: spliting on seperator results in the first array element to be '' so we shift to get rid of it.
  routes.shift();

  // Trim the first folder after entrypoints if it is named the same as the page type.
  if ((routes[0] || '').toUpperCase() === type.toUpperCase()) {
    routes = routes.slice(1);
  }

  // add on the file name as the last route
  routes.push(fileName);

  return routes;
};

/** Returns an object of the end most extention and the filename minus that extension.
 * This may be used mulitiple times on a string to retirve all extensions.
 */
const parseExtension = fileName => ({
  name: fileName.replace(/\.[^.]+$/, ''),
  extension: /[^.]+$/.exec(fileName)[0],
});

const configHelpers = {
  startCase,
  pageTypes,
  relativePath,
  getNamespace,
  getRoutes,
  parseExtension,
};

module.exports = configHelpers;
