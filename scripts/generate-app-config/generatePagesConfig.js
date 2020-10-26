const path = require('path');
const glob = require('glob');
const kebabCase = require('lodash.kebabcase');
const {
  startCase,
  pageTypes,
  getNamespace,
  getRoutes,
  parseExtension,
} = require('./configHelpers');

/**
* Creates the basic page config consisting of name of the page, the route to the page and the sort group for the page.
*/
const pageConfig = (route) => {
  // Grab the group extension if one exists.
  const { name, extension: group } = parseExtension(route);

  return {
    text: startCase(name),
    group,
  };
};

const generateUrl = (routes, namespace, primaryPath) => (
  `${primaryPath}/${kebabCase(namespace)}/${routes.map((route) => kebabCase(route.replace(/\.[^.]+$/, ''))).join('/')}`
);

/**
* Recursively generates page configs.
*/
const recurs = ({
  config, routes, contentPath, ext, namespace, imports, url,
}) => {
  // Prefer modifying config over creating new config, this way we blend file paths together in the ui.
  const configCopy = config || pageConfig(routes[0], namespace);

  // Pop off the top most directory.
  const slicedDir = routes.slice(1);

  // If this is not an end point, recursively gather the child pages.
  if (slicedDir.length > 0) {
    if (!configCopy.children) {
      configCopy.children = {};
    }

    configCopy.children[slicedDir[0]] = recurs({
      config: configCopy.children[slicedDir[0]], routes: slicedDir, contentPath, ext, imports, url,
    });
  } else {
    // if this is a leaf page, add the content path and type to the config.
    configCopy.content = contentPath;
    configCopy.path = url;
    // eslint-disable-next-line no-param-reassign
    imports[url] = contentPath;
    configCopy.type = ext;
  }

  return configCopy;
};

/**
* Builds out config for a root page.
*/
const buildPageConfig = ({
  filePaths,
  namespace,
  imports,
  primaryNavItemsMap,
}) => (
  filePaths.reduce((acc, { filePath, entryPoint }) => {
    // Break up the file path
    const parsedPath = path.parse(filePath);
    // Grab the type (doc, test, etc) and the name without the extension.
    const { name, extension: fileType } = parseExtension(parsedPath.name);

    const referenceNavItem = primaryNavItemsMap[fileType];
    let primaryNavItem = acc[referenceNavItem.path];
    if (!primaryNavItem) {
      primaryNavItem = {
        text: referenceNavItem.text,
        path: referenceNavItem.path,
        children: {},
      };
      acc[referenceNavItem.path] = primaryNavItem;
    }

    const directory = parsedPath.dir;
    // Drop the period for the extension.
    const ext = parsedPath.ext.slice(1);

    const routes = getRoutes(name, entryPoint);
    const packageNamespace = getNamespace(directory, namespace);

    const key = routes[0];
    primaryNavItem.children[key] = recurs({
      config: primaryNavItem.children[key],
      routes,
      contentPath: filePath,
      ext,
      namespace: packageNamespace,
      imports,
      url: generateUrl(routes, namespace, primaryNavItem.path),
    });
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
  config.sort(sortPage).map((page) => {
    // eslint-disable-next-line no-param-reassign
    // delete page.group;
    if (page.children) {
      // eslint-disable-next-line no-param-reassign
      page.children = sortPageConfig(Object.values(page.children));
    }
    return page;
  })
);

const getSearchPatterns = ({
  generatePagesOptions, navConfig, resolveExtensions, mode,
}) => {
  const typesGlob = pageTypes(navConfig).join(',');
  const typesRegex = pageTypes(navConfig).map((type) => `/${type}`).join('|');

  // remove . from extensions
  const extensions = resolveExtensions.map((ext) => ext.slice(1));

  // the markdown extension is not optional.
  const ext = [...extensions, 'md', 'mdx'];

  return generatePagesOptions.searchPatterns.reduce((acc, {
    root, source, dist, entryPoint,
  }) => {
    const rootPath = root.replace(/[\\]/g, '/');
    let sourceDir = '';
    if (dist) {
      sourceDir = (mode !== 'production' && source) ? `${source}/` : `${dist}/`;
    }
    acc.push({
      pattern: `${rootPath}/${sourceDir}${entryPoint}/**/*.{${typesGlob},}.{${ext.join(',')}}`,
      entryPoint: `${rootPath}/${sourceDir}${entryPoint}(${typesRegex})`,
    });
    acc.push({
      pattern: `${rootPath}/packages/*/${sourceDir}${entryPoint}/**/*.{${typesGlob},}.{${ext.join(',')}}`,
      // build out a regex for the entrypoint mask.
      entryPoint: `${rootPath}/packages/[^/]*/${sourceDir}${entryPoint}(${typesRegex})`,
    });
    return acc;
  }, []);
};

const executeSearchPatterns = ({ patterns }) => (
  patterns.reduce((acc, { pattern, entryPoint }) => (
    acc.concat(glob.sync(pattern, { nodir: true }).map(filePath => ({ filePath, entryPoint: filePath.replace(new RegExp(entryPoint).exec(filePath)[0], '') })))
  ), [])
);

/**
* Generates the file representing page config, which is in turn consumed by route config.
*/
const generatePagesConfig = (siteConfig, resolveExtensions, mode, verbose) => {
  const {
    generatePages: generatePagesOptions, navConfig,
  } = siteConfig;

  // remove . from extensions
  const extensions = resolveExtensions.map((ext) => ext.slice(1));

  // Get the default search patterns for both normal and lerna mono repos.
  const patterns = getSearchPatterns({
    generatePagesOptions, navConfig, resolveExtensions, mode,
  });

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log('[terra-dev-site] Patterns', patterns);
  }

  // Execute the globs and regex masks, to trim the directories.
  const filePaths = executeSearchPatterns({ patterns });

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log('[terra-dev-site] File Paths', filePaths);
  }

  const imports = {};

  const primaryNavItemsMap = navConfig.navigation.links.reduce((acc, link) => {
    acc[link.pageType] = link;
    return acc;
  }, {});

  // Build out the page config from the discovered file paths.
  const config = buildPageConfig({
    filePaths, namespace: siteConfig.npmPackage.name, imports, primaryNavItemsMap,
  });

  const sortedConfig = navConfig.navigation.links.reduce((acc, link) => {
    const conf = config[link.path];
    if (conf) {
      conf.children = sortPageConfig(Object.values(conf.children));
      acc.push(conf);
    }
    return acc;
  }, []);

  if (true) {
    // eslint-disable-next-line no-console
    console.log('[terra-dev-site] Page Config', JSON.stringify(sortedConfig, null, 2));
  }

  return { imports, content: sortedConfig };
};

module.exports = generatePagesConfig;
