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

const monoRepoNamespace = (directory) => {
  const namespace = (/packages\/([^/]*)/.exec(directory) || {})[1];
  if (namespace) {
    return namespace.replace('terra-'); // this is kind of a hack and I don't like it.
  }

  return undefined;
};

const getRoutes = (directory, type, fileName, generatePagesOptions) => {
  // console.log('packageName', packageName);
  let routes = directory.split(path.sep);
  // Note: spliting on seperator results in the first array element to be '' so we shift to get rid of it.
  routes.shift();

  generatePagesOptions.entryPointDirs.forEach((entryPoint) => { routes = truncateRoutes(entryPoint, routes); });
  routes = truncateRoutes('terra-dev-site', routes); // hack
  routes = truncateRoutes(type, routes);
  // console.log('routes', routes);

  const namespace = monoRepoNamespace(directory);

  if (namespace) {
    routes.unshift(namespace);
  }

  // add on the file name as the last route
  routes.push(fileName);

  // console.log('name', name);

  return routes;
};

const pageConfig = route => (
  {
    name: startCase(route),
    path: `/${kebabCase(route)}`,
  }
);

const recurs = (config, routes, componentPath) => {
  // console.log('config', config);
  const configCopy = config || pageConfig(routes[0]);

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

const buildPageConfig = (filePaths, generatePagesOptions) => (
  filePaths.reduce((acc, filePath) => {
    const parsedPath = path.parse(filePath);
    const fileType = /[^.]+$/.exec(parsedPath.name)[0];

    let pages = acc[fileType];
    if (!pages) {
      pages = {};
      acc[fileType] = pages;
    }

    const directory = parsedPath.dir;
    const componentPath = relativePath(path.join(directory, parsedPath.name));
    const name = parsedPath.name.replace(/\.[^.]+$/, '');
    const routes = getRoutes(directory, fileType, name, generatePagesOptions);

    pages[routes[0]] = recurs(pages[routes[0]], routes, componentPath);
    // console.log(acc);
    return acc;
  }, {})
);

const generatePagesConfig = (siteConfig, production) => {
  const { generatePages: generatePagesOptions, pagesConfig, navConfig } = siteConfig;
  if (pagesConfig) {
    return pagesConfig;
  }

  const souceDir = production ? 'lib' : 'src';

  const rootPaths = generatePagesOptions.roots.reduce((acc, dir) => {
    acc.push(path.join(dir, souceDir, `{${generatePagesOptions.entryPointDirs.join()},}`));
    acc.push(path.join(dir, 'packages', '*', souceDir, `{${generatePagesOptions.entryPointDirs.join()},}`));
    return acc;
  }, []);

  const types = pageTypes(navConfig);

  const searchPaths = defaultSearchPaths(types, rootPaths).concat(generatePagesOptions.searchPatterns);
  console.log('searchPaths', searchPaths);

  const filePaths = searchPaths.reduce((acc, searchPath) => acc.concat(glob.sync(searchPath, { nodir: true })), []);

  console.log('files', filePaths);

  // const packageName = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'))).name;

  const config = buildPageConfig(filePaths, generatePagesOptions);

  console.log('config', JSON.stringify(config, null, 2));

  return config;
};

module.exports = generatePagesConfig;
