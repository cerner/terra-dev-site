const path = require('path');
const glob = require('glob');
const kebabCase = require('lodash.kebabcase');
const startCase = require('lodash.startcase');

const pageTypes = navConfig => (navConfig.navigation.links.reduce((acc, link) => acc.concat(link.pageTypes), []));

const relativePath = componentPath => (path.relative(path.join(process.cwd(), 'dev-site-config'), componentPath));

const getNamespace = (directory, namespace) => {
  const afterPackages = (/packages\/([^/]*)/.exec(directory) || {})[1];
  const afterNodeModules = (/node_modules\/([^/]*)/.exec(directory) || {})[1];

  return afterPackages || afterNodeModules || namespace;
};

const getRoutes = (directory, type, fileName, entryPoint) => {
  // Remove the directories up to the entry point.
  const modifiedDirectory = directory.replace(entryPoint, '');

  let routes = modifiedDirectory.split(path.sep);

  // Note: spliting on seperator results in the first array element to be '' so we shift to get rid of it.
  routes.shift();

  // Trim the first folder after entrypoints if it is named the same as type
  if (routes[0] === type) {
    routes = routes.slice(1);
  }

  // add on the file name as the last route
  routes.push(fileName);

  return routes;
};

const pageConfig = (route, namespace) => {
  const pagePath = namespace ? `/${kebabCase(namespace)}/${kebabCase(route)}` : `/${kebabCase(route)}`;
  return {
    name: startCase(route),
    path: pagePath,
  };
};

const recurs = (config, routes, contentPath, namespace) => {
  const configCopy = config || pageConfig(routes[0], namespace);

  const slicedDir = routes.slice(1);

  if (slicedDir.length > 0) {
    if (!configCopy.pages) {
      configCopy.pages = {};
    }

    configCopy.pages[slicedDir[0]] = recurs(configCopy.pages[slicedDir[0]], slicedDir, contentPath);
  } else {
    configCopy.content = contentPath;
  }

  return configCopy;
};

const buildPageConfig = (filePaths, generatePagesOptions, namespace) => (
  filePaths.reduce((acc, { filePath, entryPoint }) => {
    const parsedPath = path.parse(filePath);
    const fileType = /[^.]+$/.exec(parsedPath.name)[0];

    let pages = acc[fileType];
    if (!pages) {
      pages = {};
      acc[fileType] = pages;
    }

    const directory = parsedPath.dir;
    const contentPath = relativePath(path.join(directory, parsedPath.name));
    const name = parsedPath.name.replace(/\.[^.]+$/, '');
    const routes = getRoutes(directory, fileType, name, entryPoint);
    const packageNamespace = getNamespace(directory, namespace);
    const key = `${packageNamespace}:${routes[0]}`;
    pages[key] = recurs(pages[key], routes, contentPath, packageNamespace);
    // console.log(acc);
    return acc;
  }, {})
);

const generatePagesConfig = (siteConfig, production) => {
  const { generatePages: generatePagesOptions, pagesConfig, navConfig, hotReloading } = siteConfig;
  if (pagesConfig) {
    return pagesConfig;
  }

  const types = pageTypes(navConfig).join(',');

  // console.log('types', types);

  const defaultPatterns = generatePagesOptions.searchPatterns.reduce((acc, { root, source, dist, entryPoint }) => {
    // console.log('root', root)
    const souceDir = (production || !hotReloading.enabled) ? dist : source;
    acc.push({
      pattern: path.join(root, souceDir, entryPoint, '**', `*.{${types},}.{jsx,js}`),
      entryPoint: path.join(root, souceDir, entryPoint),
    });
    acc.push({
      pattern: path.join(root, 'packages', '*', souceDir, entryPoint, '**', `*.{${types},}.{jsx,js}`),
      entryPoint: path.join(root, 'packages', '[^/]*', souceDir, entryPoint),
    });
    return acc;
  }, []);

  const customPatterns = generatePagesOptions.customPatterns || [];

  const patterns = defaultPatterns.concat(customPatterns);
  // console.log('searchPaths', patterns);

  const filePaths = patterns.reduce((acc, { pattern, entryPoint }) => (
    acc.concat(glob.sync(pattern, { nodir: true }).map(filePath => ({ filePath, entryPoint: new RegExp(entryPoint).exec(filePath)[0] })))
  ), []);

  // console.log('files', filePaths);

  const config = buildPageConfig(filePaths, generatePagesOptions, siteConfig.npmPackage.name);

  // console.log('config', JSON.stringify(config, null, 2));

  return config;
};

module.exports = generatePagesConfig;
