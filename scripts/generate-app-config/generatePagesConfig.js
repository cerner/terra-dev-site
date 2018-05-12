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
  if ((routes[0] || '').toUpperCase() === type.toUpperCase()) {
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

const recurs = (config, routes, contentPath, ext, namespace) => {
  const configCopy = config || pageConfig(routes[0], namespace);

  const slicedDir = routes.slice(1);

  if (slicedDir.length > 0) {
    if (!configCopy.pages) {
      configCopy.pages = {};
    }

    configCopy.pages[slicedDir[0]] = recurs(configCopy.pages[slicedDir[0]], slicedDir, contentPath, ext);
  } else {
    configCopy.content = contentPath;
    configCopy.type = ext;
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
    const ext = parsedPath.ext.slice(1);
    const fileName = (ext === 'jsx' || ext === 'js') ? parsedPath.name : parsedPath.base;
    const contentPath = relativePath(path.join(directory, fileName));
    const name = parsedPath.name.replace(/\.[^.]+$/, '');
    const routes = getRoutes(directory, fileType, name, entryPoint);
    const packageNamespace = getNamespace(directory, namespace);
    const key = `${packageNamespace}:${routes[0]}`;

    pages[key] = recurs(pages[key], routes, contentPath, ext, packageNamespace);
    // console.log(acc);
    return acc;
  }, {})
);

const sortPage = (a, b) => {
  const nameA = a.name.toUpperCase(); // ignore upper and lowercase
  const nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
};

const sortPageConfig = config => (
  Object.values(config).sort(sortPage).map((page) => {
    if (page.pages) {
      // eslint-disable-next-line no-param-reassign
      page.pages = sortPageConfig(page.pages);
    }
    return page;
  })
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
      pattern: path.join(root, souceDir, entryPoint, '**', `*.{${types},}.{jsx,js,md}`),
      entryPoint: path.join(root, souceDir, entryPoint),
    });
    acc.push({
      pattern: path.join(root, 'packages', '*', souceDir, entryPoint, '**', `*.{${types},}.{jsx,js,md}`),
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

  const sortedConfig = Object.keys(config).reduce((acc, key) => {
    acc[key] = sortPageConfig(config[key]);
    return acc;
  }, {});

  console.log('config', JSON.stringify(sortedConfig, null, 2));

  return sortedConfig;
};

module.exports = generatePagesConfig;
