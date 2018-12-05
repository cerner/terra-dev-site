const path = require('path');
const glob = require('glob');
const kebabCase = require('lodash.kebabcase');
const {
  startCase,
  relativePath,
  getNamespace,
  parseExtension,
} = require('./configHelpers');

const getScreenshotPatterns = generatePagesOptions => (
  generatePagesOptions.searchPatterns.reduce((acc, { root }) => {
    const rootPath = root.replace(/[\\]/g, '/');
    acc.push({
      pattern: `${rootPath}/packages/*/{test,tests}/wdio/**/__snapshots__/reference/**/*.png`,
      // build out a regex for the entrypoint mask.
      entryPoint: `${rootPath}/packages/[^/]*/(test|tests)/wdio/.*__snapshots__/reference/`,
    });
    acc.push({
      pattern: `${rootPath}/{test,tests}/wdio/**/__snapshots__/reference/**/*.png`,
      // build out a regex for the entrypoint mask.
      entryPoint: `${rootPath}/(test|tests)/wdio/.*__snapshots__/reference/`,
    });
    return acc;
  }, [])
);

const createEvidenceParent = packageNamespace => (
  {
    name: startCase(packageNamespace),
    path: `/${kebabCase(packageNamespace)}`,
    group: '',
    pages: {},
  }
);

const createLocaleParent = (packageNamespace, locale) => (
  {
    name: startCase(locale),
    path: `/${kebabCase(packageNamespace)}/${kebabCase(locale)}`,
    group: '',
    pages: {},
  }
);

const createEvidencePage = (packageNamespace, locale, name) => (
  {
    name: startCase(name),
    path: `/${kebabCase(packageNamespace)}/${kebabCase(locale)}/${kebabCase(name)}`,
    group: '',
    content: {},
    type: 'evidence',
  }
);

const generateEvidenceConfig = (generatePagesOptions, namespace) => {
  const patterns = getScreenshotPatterns(generatePagesOptions);

  // Execute the globs and regex masks, to trim the directories.
  const filePaths = patterns.reduce((acc, { pattern, entryPoint }) => (
    acc.concat(glob.sync(pattern, { nodir: true }).map(filePath => ({ filePath, entryPoint: new RegExp(entryPoint).exec(filePath)[0] })))
  ), []);

  const combinedPaths = filePaths.reduce((acc, { filePath }) => {
    // Break up the file path
    const parsedPath = path.parse(filePath);
    // Grab the type (doc, test, etc) and the name without the extension.
    const { name } = parseExtension(parsedPath.name);
    const directory = parsedPath.dir;
    const contentPath = relativePath(filePath);
    const packageNamespace = getNamespace(directory, namespace);
    const subpath = parsedPath.dir.split('__snapshots__/')[1].split('/');
    const locale = subpath[1];

    const nameKey = `${packageNamespace}:${name}`;
    const localeKey = `${packageNamespace}:${locale}`;

    let parent = acc;
    if (packageNamespace !== namespace) {
      let parentPage = acc[packageNamespace];
      if (!parentPage) {
        parentPage = createEvidenceParent(packageNamespace);
        acc[packageNamespace] = parentPage;
      }
      parent = parentPage.pages;
    }

    let localePage = parent[localeKey];
    if (!localePage) {
      localePage = createLocaleParent(packageNamespace, locale);
      parent[localeKey] = localePage;
    }
    parent = localePage.pages;

    let page = parent[nameKey];
    if (!page) {
      page = createEvidencePage(packageNamespace, locale, name);
      parent[nameKey] = page;
    }
    page.content[subpath[2]] = contentPath;

    return acc;
  }, {});

  return combinedPaths;
};

module.exports = generateEvidenceConfig;
