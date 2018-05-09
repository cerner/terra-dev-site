const path = require('path');
const glob = require('glob');
// const fs = require('fs');
const kebabCase = require('lodash.kebabcase');
const startCase = require('lodash.startcase');

const pageTypes = navConfig => (navConfig.navigation.links.map(link => link.pageType));

const relativePath = componentPath => (path.relative(path.join(process.cwd(), 'dev-site-config'), componentPath));

const defaultSearchPaths = (types, rootPaths) => (
  rootPaths.map((rootPath) => {
    const typesString = types.reduce((acc, type) => `${acc}${type},`, '');
    return path.join(rootPath, '**', `*.{${typesString}}.{jsx,js}`);
  })
);

const truncateRoutes = (dir, routes) => {
  const index = routes.findIndex(element => element === dir);

  if (index >= 0) {
    // console.log('routes', routes);
    return routes.slice(index + 1);
  }

  return routes;
};

const getRoutes = (directory, type, fileName) => {
  // console.log('packageName', packageName);
  let routes = directory.split(path.sep);
  // Note: spliting on seperator results in the first array element to be '' so we shift to get rid of it.
  routes.shift();

  routes = truncateRoutes('terra-dev-site', routes);
  routes = truncateRoutes('terra-dev-site', routes);
  routes = truncateRoutes(type, routes);
  // console.log('routes', routes);

  // add on the file name as the last route
  routes.push(fileName);

  // console.log('name', name);

  return routes;
};

const pageConfig = route => (
  {
    name: `${startCase(route)}`,
    path: `/${kebabCase(route)}`,
  }
);

const recurs = (config, routes, componentPath) => {
  // console.log('config', config);
  const configCopy = config || pageConfig(routes[0]);
  // {
  //   name: `${startCase(routes[0])}`,
  //   path: `/${kebabCase(routes[0])}`,
  // };

  // console.log('routes', routes);

  const slicedDir = routes.slice(1);

  // console.log('slicedDir', slicedDir);

  if (slicedDir.length > 0) {
    if (!configCopy.pages) {
      configCopy.pages = {};
    }

    configCopy.pages[slicedDir[0]] = recurs(configCopy.pages[slicedDir[0]], slicedDir, componentPath);
  } else {
    // console.log('componentPath', componentPath);
    configCopy.component = componentPath;
  }

  // console.log('configCopy', configCopy);

  return configCopy;
};

const buildPageConfig = filePaths => (
  filePaths.reduce((acc, filePath) => {
    // console.log('filePath', filePath);
    const parsedPath = path.parse(filePath);
    const directory = parsedPath.dir;
    // console.log(directory);
    const fileType = /[^.]+$/.exec(parsedPath.name)[0];
    // console.log(fileType);
    const name = parsedPath.name.replace(/\.[^.]+$/, '');
    // console.log(name);
    const componentPath = relativePath(path.join(directory, parsedPath.name));
    // console.log('relativePath', componentPath);
    const routes = getRoutes(directory, fileType, name);
    // console.log('updatedPackageName', updatedPackageName);

    let pages = acc[fileType];
    if (!pages) {
      pages = {};
      acc[fileType] = pages;
    }

    pages[routes[0]] = recurs(pages[routes[0]], routes, componentPath);
    // console.log(acc);
    return acc;
  }, {})
);

const generatePagesConfig = (siteConfig) => {
  const { generatePages: generatePagesOptions, pagesConfig, navConfig } = siteConfig;
  console.log('generatePagesOptions', generatePagesOptions);
  if (pagesConfig) {
    return pagesConfig;
  }

  const rootPaths = generatePagesOptions.roots.reduce((acc, dir) => {
    acc.push(path.resolve(path.join(dir, 'lib', generatePagesOptions.dir)));
    acc.push(path.resolve(path.join(dir, 'packages', '*', 'lib', generatePagesOptions.dir)));
    return acc;
  }, []);

  const types = pageTypes(navConfig);

  const searchPaths = defaultSearchPaths(types, rootPaths).concat(generatePagesOptions.searchPatterns);
  console.log('searchPaths', searchPaths);

  const filePaths = searchPaths.reduce((acc, searchPath) => acc.concat(glob.sync(searchPath, { nodir: true })), []);

  console.log('files', filePaths);

  // const packageName = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'))).name;

  const config = buildPageConfig(filePaths);

  console.log('config', JSON.stringify(config, null, 2));

  return config;
};

module.exports = generatePagesConfig;
