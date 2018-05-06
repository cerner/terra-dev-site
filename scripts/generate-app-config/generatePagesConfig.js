const path = require('path');
const glob = require('glob');

const pageTypes = navConfig => (navConfig.navigation.links.map(link => link.exampleType));

const defaultSearchPaths = (types, rootPaths) => (
  rootPaths.map((rootPath) => {
    const typesString = types.reduce((acc, type) => `${acc}${type},`, '');
    return path.join(rootPath, '**', `*.{${typesString}}.{jsx,js}`);
  })
);

const generatePagesConfig = (siteConfig) => {
  const { generatePages: generatePagesOptions, pagesConfig, navConfig } = siteConfig;
  console.log('generatePagesOptions', generatePagesOptions);
  if (pagesConfig) {
    return pagesConfig;
  }

  const rootPaths = generatePagesOptions.roots.reduce((acc, root) => {
    acc.push(path.resolve(path.join(root, 'lib', generatePagesOptions.dir)));
    acc.push(path.resolve(path.join(root, '*', 'lib', generatePagesOptions.dir)));
    return acc;
  }, []);

  const types = pageTypes(navConfig);

  const searchPaths = defaultSearchPaths(types, rootPaths).concat(generatePagesOptions.searchPatterns);
  console.log('searchPaths', searchPaths);

  let foundFiles = [];
  searchPaths.forEach((searchPath) => {
    foundFiles = foundFiles.concat(glob.sync(searchPath, { nodir: true }));
  });

  const files = searchPaths.reduce((acc, searchPath) => acc.concat(glob.sync(searchPath, { nodir: true })), []);

  // const files = searchPaths.reduce((acc, searchPath) => {
  //   const globs = glob.sync(searchPath, { nodir: true });
  //   acc.concat(globs, []);
  // });
  console.log('files', files);

  return {};
};

module.exports = generatePagesConfig;
