const path = require('path');
const glob = require('glob');
const kebabCase = require('lodash.kebabcase');
const generateEvidenceConfig = require('./generateEvidenceConfig');
const {
  startCase,
  pageTypes,
  relativePath,
  getNamespace,
  getRoutes,
  parseExtension,
} = require('./configHelpers');

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
  // Prefer modifying config over creating new config, this way we blend file paths together in the ui.
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
const buildPageConfig = (filePaths, resolveExtensions, namespace) => (
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
    // Drop the period for the extension.
    const ext = parsedPath.ext.slice(1);
    // For the resolve extensions identified in the webpack config we want to drop the extension to be resolved by webpack.
    const fileName = (resolveExtensions.includes(ext)) ? parsedPath.name : parsedPath.base;
    const contentPath = relativePath(path.join(directory, fileName));
    const routes = getRoutes(directory, fileType, name, entryPoint);
    const packageNamespace = getNamespace(directory, namespace);
    // Name space all the generated config by package.
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
  // eslint-disable-next-line compat/compat
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
const generatePagesConfig = (siteConfig, resolveExtensions, mode, verbose) => {
  const {
    generatePages: generatePagesOptions, pagesConfig, navConfig, hotReloading,
  } = siteConfig;
  // If a pages config is supplied don't do this logic.
  if (pagesConfig) {
    return pagesConfig;
  }

  // Gather the types to search for.
  const types = pageTypes(navConfig).join(',');

  // remove . from extensions
  const extensions = resolveExtensions.map((ext) => ext.slice(1));

  // the markdown extension is not optional.
  const ext = [...extensions, 'md', 'mdx'];

  // Get the default search patterns for both normal and lerna mono repos.
  const patterns = generatePagesOptions.searchPatterns.reduce((acc, {
    root, source, dist, entryPoint,
  }) => {
    const rootPath = root.replace(/[\\]/g, '/');
    let sourceDir = '';
    if (dist) {
      sourceDir = (mode !== 'production' && hotReloading && source) ? `${source}/` : `${dist}/`;
    }
    acc.push({
      pattern: `${rootPath}/${sourceDir}${entryPoint}/**/*.{${types},}.{${ext.join(',')}}`,
      entryPoint: `${rootPath}/${sourceDir}${entryPoint}`,
    });
    acc.push({
      pattern: `${rootPath}/packages/*/${sourceDir}${entryPoint}/**/*.{${types},}.{${ext.join(',')}}`,
      // build out a regex for the entrypoint mask.
      entryPoint: `${rootPath}/packages/[^/]*/${sourceDir}${entryPoint}`,
    });
    return acc;
  }, []);

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log('[terra-dev-site] Patterns', patterns);
  }

  // Execute the globs and regex masks, to trim the directories.
  const filePaths = patterns.reduce((acc, { pattern, entryPoint }) => (
    acc.concat(glob.sync(pattern, { nodir: true }).map(filePath => ({ filePath, entryPoint: new RegExp(entryPoint).exec(filePath)[0] })))
  ), []);

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log('[terra-dev-site] File Paths', filePaths);
  }

  // Build out the page config from the discovered file paths.
  const config = buildPageConfig(filePaths, extensions, siteConfig.npmPackage.name);

  // Check config here
  if (siteConfig.includeTestEvidence) {
    config.evidence = generateEvidenceConfig(generatePagesOptions, siteConfig.npmPackage.name);
  }

  // Sort config and convert pages objects into ordered arrays.
  const sortedConfig = Object.keys(config).reduce((acc, key) => {
    acc[key] = sortPageConfig(config[key]);
    return acc;
  }, {});

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log('[terra-dev-site] Page Config', JSON.stringify(sortedConfig, null, 2));
  }

  return sortedConfig;
};

module.exports = generatePagesConfig;
