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
const getPageConfig = (route) => {
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
  config, routes, contentPath, ext, namespace, contentImports, url, pageConfig,
}) => {
  // Prefer modifying config over creating new config, this way we blend file paths together in the ui.
  const configCopy = config || getPageConfig(routes[0], namespace);

  // Pop off the top most directory.
  const slicedDir = routes.slice(1);

  // If this is not an end point, recursively gather the child pages.
  if (slicedDir.length > 0) {
    if (!configCopy.children) {
      configCopy.children = {};
    }

    configCopy.children[slicedDir[0]] = recurs({
      config: configCopy.children[slicedDir[0]],
      routes: slicedDir,
      contentPath,
      ext,
      contentImports,
      url,
      pageConfig,
    });
  } else {
    // if this is a leaf page, add the content path and type to the config.
    // configCopy.content = contentPath;
    configCopy.path = url;
    // eslint-disable-next-line no-param-reassign
    contentImports[url] = contentPath;
    configCopy.type = ext;
    // eslint-disable-next-line no-param-reassign
    pageConfig[url] = {
      text: configCopy.text,
      type: ext,
    };
  }

  return configCopy;
};

/**
* Builds out config for a root page.
*/
const buildPageConfig = ({
  filePaths,
  namespace,
  contentImports,
  primaryNavItemsMap,
  pageConfig,
}) => (
  filePaths.reduce((acc, { filePath, entryPoint }) => {
    // Break up the file path
    const parsedPath = path.parse(entryPoint);
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
      contentImports,
      url: generateUrl(routes, namespace, primaryNavItem.path),
      pageConfig,
    });
    return acc;
  }, {})
);

/**
* Simple alpha sort. Copied from MDN, if I'm (Matt) being honest.
*/
const alphaSort = (a, b) => {
  if (a && !b) {
    return 1;
  }

  if (!a && b) {
    return -1;
  }

  if (!a && !b) {
    return 0;
  }

  const nameA = a.toUpperCase(); // ignore upper and lowercase
  const nameB = b.toUpperCase(); // ignore upper and lowercase
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
    result = alphaSort(a.text, b.text);
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
  generatePagesOptions, navigation, resolveExtensions, mode,
}) => {
  const typesGlob = pageTypes(navigation).join(',');
  const typesRegex = pageTypes(navigation).map((type) => `/${type}`).join('|');

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

const findFirstPagePath = (navItem) => {
  if (navItem.children) {
    return findFirstPagePath(navItem.children[0]);
  }
  return navItem.path;
};

/**
* Generates the file representing page config, which is in turn consumed by route config.
*/
const generatePagesConfig = (siteConfig, resolveExtensions, mode, verbose) => {
  const {
    generatePages: generatePagesOptions, navigation,
  } = siteConfig;

  // Get the default search patterns for both normal and lerna mono repos.
  const patterns = getSearchPatterns({
    generatePagesOptions, navigation, resolveExtensions, mode,
  });

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log('[terra-dev-site] Patterns', patterns);
  }

  // Execute the globs and regex masks, to trim the directories.
  const filePaths = executeSearchPatterns({ patterns });

  // Inject the home page readme.
  filePaths.push({
    filePath: siteConfig.readMeContent,
    entryPoint: '/home.home.md',
  });

  if (true) {
    // eslint-disable-next-line no-console
    console.log('[terra-dev-site] File Paths', filePaths);
  }

  const contentImports = {};
  const pageConfig = {};

  const primaryNavItemsMap = navigation.primaryNavigationItems.reduce((acc, primaryNavigationItem) => {
    acc[primaryNavigationItem.pageType] = primaryNavigationItem;
    return acc;
  }, {});

  // Build out the page config from the discovered file paths.
  const config = buildPageConfig({
    filePaths, namespace: siteConfig.npmPackage.name, contentImports, primaryNavItemsMap, pageConfig,
  });

  const primaryNavPathToFirstPagePathMap = {};

  const sortedConfig = navigation.primaryNavigationItems.reduce((acc, primaryNavigationItem) => {
    const navItem = config[primaryNavigationItem.path];
    if (navItem) {
      navItem.children = sortPageConfig(Object.values(navItem.children));

      primaryNavPathToFirstPagePathMap[navItem.path] = findFirstPagePath(navItem);

      if (navItem.children.length === 1 && !navItem.children[0].children) {
        [navItem.pageConfig] = navItem.children;
        delete navItem.children;
      }

      acc.push(navItem);
    }
    return acc;
  }, []);

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log('[terra-dev-site] Page Config', JSON.stringify(sortedConfig, null, 2));
  }

  const { index } = navigation;
  if (index) {
    const fullIndexPath = primaryNavPathToFirstPagePathMap[index];
    if (fullIndexPath) {
      primaryNavPathToFirstPagePathMap['/'] = fullIndexPath;
    }
  }

  return {
    contentImports,
    navigationConfig: sortedConfig,
    primaryNavPathToFirstPagePathMap,
    pageConfig,
  };
};

module.exports = generatePagesConfig;
