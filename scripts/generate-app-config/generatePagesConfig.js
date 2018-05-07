const path = require('path');
const glob = require('glob');
const fs = require('fs');
const kebabCase = require('lodash.kebabcase');
const startCase = require('lodash.startcase');

const pageTypes = navConfig => (navConfig.navigation.links.map(link => link.exampleType));

const relativePath = componentPath => (path.relative(path.join(process.cwd(), 'dev-site-config'), componentPath));

const defaultSearchPaths = (types, rootPaths) => (
  rootPaths.map((rootPath) => {
    const typesString = types.reduce((acc, type) => `${acc}${type},`, '');
    return path.join(rootPath, '**', `*.{${typesString}}.{jsx,js}`);
  })
);

const splitDirectory = (packageName, directory) => {

  const split = directory.split(path.sep)

  let packageIndex = split.findIndex(element => element === 'packages')

  if (packageIndex) {
      // The package name is the first directory name after packages.
      // Note: spliting on seperator results in the first array element to be ''
      console.log('split', split);
      console.log('packageIndex', packageIndex);
      console.log('derp ', split[packageIndex+1]);
      return { packageName: split[packageIndex + 1], dirs: split.slice(packageIndex + 1) };
  }

  packageIndex = split.findIndex(element => element === packageName)

  return { packageName, dirs: split.slice(packageIndex) };
};

const recurs = (config, type, dirs, componentPath) => {
  let configCopy = config || {
    name: `'${startCase(dirs[0])}'`,
    path: `'/${kebabCase(dirs[0])}'`,
    key: dirs[0],
  };

  const slicedDir = dirs.slice(1);

  if(slicedDir.length > 0){
    if (!configCopy[type]) {
      configCopy[type] = [];
    }
    // console.log('config copy', configCopy);
    const nextConfig = configCopy[type].find(item => item.key === slicedDir[0]);

    if (nextConfig) {
      recurs(nextConfig, type, slicedDir, componentPath);
    } else {
      configCopy[type].push(recurs(nextConfig, type, slicedDir, componentPath));
    }
  } else {
    configCopy.component = componentPath;
  }

  return configCopy;
}

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
    const {packageName: updatedPackageName, dirs} = splitDirectory(packageName, directory);
    console.log('updatedPackageName', updatedPackageName);
    acc[updatedPackageName] = recurs(acc[updatedPackageName], fileType, dirs, componentPath);
    console.log(acc);
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

  console.log('config', config);

  return config;
};

module.exports = generatePagesConfig;
