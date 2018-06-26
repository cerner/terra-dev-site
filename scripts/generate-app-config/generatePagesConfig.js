const path = require('path');
const glob = require('glob');
const kebabCase = require('lodash.kebabcase');
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
const pageTypes = navConfig => (navConfig.navigation.links.reduce((acc, link) => acc.concat(link.pageTypes), []));

/**
 * Gets the path relative to the dev-site-config directory.
 */
const relativePath = componentPath => (path.relative(path.join(process.cwd(), 'dev-site-config'), componentPath));

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

/**
* Creates the basic page config consisting of name of the page, the route to the page and the sort group for the page.
*/
const pageConfig = (route, namespace) => {
  // Grab the group extension if one exists.
  const { name, extension: group } = parseExtension(route);
  const pagePath = namespace ? `/${kebabCase(namespace)}/${kebabCase(name)}` : `/${kebabCase(name)}`;
  return {
    name: startCase(name),
    path: pagePath,
    group,
  };
};

/**
* Recursively generates page configs.
*/
const recurs = (config, routes, contentPath, ext, namespace) => {
  // Prefer modying config over creating new config, this way we blend file paths together in the ui.
  const configCopy = config || pageConfig(routes[0], namespace);

  // Pop off the top most directory.
  const slicedDir = routes.slice(1);

  // If this is not an end point, recursively gather the child pages.
  if (slicedDir.length > 0) {
    if (!configCopy.pages) {
      configCopy.pages = {};
    }

    configCopy.pages[slicedDir[0]] = recurs(configCopy.pages[slicedDir[0]], slicedDir, contentPath, ext);
  } else {
    // if this is a leaf page, add the content path and type to the config.
    configCopy.content = contentPath;
    configCopy.type = ext;
  }

  return configCopy;
};

/**
* Builds out config for a root page.
*/
const buildPageConfig = (filePaths, generatePagesOptions, namespace) => (
  filePaths.reduce((acc, { filePath, entryPoint }) => {
    // Break up the file path
    const parsedPath = path.parse(filePath);
    // Grab the type (doc, test, etc) and the name without the extension.
    const { name, extension: fileType } = parseExtension(parsedPath.name);

    let pages = acc[fileType];
    if (!pages) {
      pages = {};
      acc[fileType] = pages;
    }

    const directory = parsedPath.dir;
    // Drop the period for the extenion.
    const ext = parsedPath.ext.slice(1);
    // For jsx or js files, we want to drop the extention for including them, because we don't know if the file will be transpiled.
    const fileName = (ext === 'jsx' || ext === 'js') ? parsedPath.name : parsedPath.base;
    const contentPath = relativePath(path.join(directory, fileName));
    const routes = getRoutes(directory, fileType, name, entryPoint);
    const packageNamespace = getNamespace(directory, namespace);
    // Name space all the generated config by pakcage.
    const key = `${packageNamespace}:${routes[0]}`;

    pages[key] = recurs(pages[key], routes, contentPath, ext, packageNamespace);
    return acc;
  }, {})
);

/**
* Simple alpha sort. Copied from MDN, if I'm (Matt) being honest.
*/
const alphaSort = (a, b) => {
  const nameA = (a || '').toUpperCase(); // ignore upper and lowercase
  const nameB = (b || '').toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
};

/**
* Sort first by group, then by alpha as a tie breaker.
*/
const sortPage = (a, b) => {
  let result = alphaSort(a.group, b.group);
  if (result === 0) {
    result = alphaSort(a.name, b.name);
  }
  return result;
};

/**
* Sort the pages objects and convert them into ordered arrays.
*/
const sortPageConfig = config => (
  Object.values(config).sort(sortPage).map((page) => {
    if (page.pages) {
      // eslint-disable-next-line no-param-reassign
      page.pages = sortPageConfig(page.pages);
    }
    return page;
  })
);

/**
* Generates the file representing page config, which is in turn consumed by route config.
*/
const generatePagesConfig = (siteConfig, production, verbose) => {
  const {
    generatePages: generatePagesOptions, pagesConfig, navConfig, hotReloading,
  } = siteConfig;
  // If a pages config is supplied don't do this logic.
  if (pagesConfig) {
    return pagesConfig;
  }

  // Gather the types to search for.
  const types = pageTypes(navConfig).join(',');

  // Get the default search patterns for both normal and lerna mono repos.
  const patterns = generatePagesOptions.searchPatterns.reduce((acc, {
    root, source, dist, entryPoint,
  }) => {
    const rootPath = root.replace(/[\\]/g, '/');
    const sourceDir = ((!production && hotReloading) ? source : dist) || '';
    acc.push({
      pattern: `${rootPath}/${sourceDir}/${entryPoint}/**/*.{${types},}.{jsx,js,md}`,
      entryPoint: `${rootPath}/${sourceDir}/${entryPoint}`,
    });
    acc.push({
      pattern: `${rootPath}/packages/*/${sourceDir}/${entryPoint}/**/*.{${types},}.{jsx,js,md}`,
      // build out a regex for the entrypoint mask.
      entryPoint: `${rootPath}/packages/[^/]*/${sourceDir}/${entryPoint}`,
    });
    return acc;
  }, []);

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log('Patterns', patterns);
  }

  // Execute the globs and regex masks, to trim the directories.
  const filePaths = patterns.reduce((acc, { pattern, entryPoint }) => (
    acc.concat(glob.sync(pattern, { nodir: true }).map(filePath => ({ filePath, entryPoint: new RegExp(entryPoint).exec(filePath)[0] })))
  ), []);

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log('File Paths', filePaths);
  }

  // Build out the page config from the discovered file paths.
  const config = buildPageConfig(filePaths, generatePagesOptions, siteConfig.npmPackage.name);

  // Sort config and convert pages objects into ordered arrays.
  const sortedConfig = Object.keys(config).reduce((acc, key) => {
    acc[key] = sortPageConfig(config[key]);
    return acc;
  }, {});

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log('Page Config', JSON.stringify(sortedConfig, null, 2));
  }

  return sortedConfig;
};

module.exports = generatePagesConfig;
