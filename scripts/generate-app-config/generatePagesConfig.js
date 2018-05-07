const path = require('path');
const glob = require('glob');
const fs = require('fs');
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

const getRoutes = (packageName, directory, type, fileName) => {
  let routes = directory.split(path.sep);
  let name = packageName;

  const packageIndex = routes.findIndex(element => element === 'packages');

  if (packageIndex) {
    // The package name is the first directory name after packages.
    // Note: spliting on seperator results in the first array element to be ''
    name = routes[packageIndex + 1];
    routes = routes.slice(packageIndex + 1);
  }

  const devSiteIndex = routes.findIndex(element => element === 'terra-dev-site');

  if (devSiteIndex) {
    console.log('routes', routes);
    routes = routes.slice(devSiteIndex + 1);
  }

  const typeIndex = routes.findIndex(element => element === type);

  if (typeIndex) {
    console.log('routes', routes);
    routes = routes.slice(typeIndex + 1);
  }

  // add on the file name as the last route
  routes.push(fileName);

  return { name, routes };
};

const recurs = (config, type, routes, componentPath) => {
  // console.log('config', config);
  let configCopy = config || {
    name: `${startCase(routes[0])}`,
    path: `/${kebabCase(routes[0])}`,
    key: routes[0],
    pages: {},
  };

  const slicedDir = routes.slice(1);

  console.log('slicedDir', slicedDir);

  if (slicedDir.length > 0) {
    if (!configCopy.pages[type]) {
      configCopy.pages[type] = [];
    }
    const nextConfig = configCopy.pages[type].find(item => item.key === slicedDir[0]);

    if (nextConfig) {
      recurs(nextConfig, type, slicedDir, componentPath);
    } else {
      configCopy.pages[type].push(recurs(nextConfig, type, slicedDir, componentPath));
    }
  } else {
    console.log('componentPath', componentPath);
    configCopy.component = componentPath;
  }

  // console.log('configCopy', configCopy);

  return configCopy;
};

const buildPageConfig = (filePaths, packageName) => (
  filePaths.reduce((acc, filePath) => {
    console.log('filePath', filePath);
    const parsedPath = path.parse(filePath);
    const directory = parsedPath.dir;
    // console.log(directory);
    const fileType = /[^.]+$/.exec(parsedPath.name)[0];
    // console.log(fileType);
    const name = parsedPath.name.replace(/\.[^.]+$/, '');
    // console.log(name);
    const componentPath = relativePath(path.join(directory, parsedPath.name));
    // console.log('relativePath', componentPath);
    const { name: updatedPackageName, routes } = getRoutes(packageName, directory, fileType, name);
    routes.push(name);
    // console.log('updatedPackageName', updatedPackageName);
    acc[updatedPackageName] = recurs(acc[updatedPackageName], fileType, routes, componentPath);
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

  const packageName = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'))).name;

  const config = buildPageConfig(filePaths, packageName);

  console.log('config', JSON.stringify(config, null, 2));

  return config;
};

module.exports = generatePagesConfig;
