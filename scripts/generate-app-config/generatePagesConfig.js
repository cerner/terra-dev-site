const path = require('path');
const glob = require('glob');
const fs = require('fs');

const pageTypes = navConfig => (navConfig.navigation.links.map(link => link.exampleType));

const defaultSearchPaths = (types, rootPaths) => (
  rootPaths.map((rootPath) => {
    const typesString = types.reduce((acc, type) => `${acc}${type},`, '');
    return path.join(rootPath, '**', `*.{${typesString}}.{jsx,js}`);
  })
);

const buildPageConfig = (filePaths, repoName) => (
  filePaths.reduce((acc, filePath) => {
    const parsedPath = path.parse(filePath);
    const directory = parsedPath.dir;
    console.log(directory);
    const fileType = /[^.]+$/.exec(parsedPath.name);
    console.log(fileType);
    const name = parsedPath.name.replace(/\.[^.]+$/, '');
    console.log(name);
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

  const repoName = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'))).name;

  return buildPageConfig(filePaths, repoName);
};

module.exports = generatePagesConfig;
