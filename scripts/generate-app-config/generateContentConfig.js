const kebabCase = require('lodash.kebabcase');
const startCase = require('lodash.startcase');
const ImportAggregator = require('./generation-objects/ImportAggregator');

// "require" items to be added to the generated config.
const ContentWrapper = 'terra-dev-site/lib/wrappers/_ContentWrapper';
const MarkdownWrapper = 'terra-dev-site/lib/wrappers/_MarkdownWrapper';
const TerraScreenshotWrapper = 'terra-dev-site/lib/wrappers/_ScreenshotWrapper';

/**
* Setup a menuItem object.
*/
const menuItem = (name, itemPath, hasSubMenu, childItems) => ({
  name,
  path: itemPath,
  childItems,
  ...(hasSubMenu) && { hasSubMenu: true },
});

/**
 * Builds out a route item. Adds the props object conditionally.
 */
const routeItem = (name, routePath, { contentPath, importName, identifier }, props, routeImporter) => ({
  name,
  path: routePath,
  component: {
    default: {
      componentClass: routeImporter.addImport(ImportAggregator.relativePath(contentPath), importName, identifier),
      ...(props) && { props },
    },
  },
});

const evidenceProps = (contentConfig, routeImporter) => {
  const contentCopy = { ...contentConfig };
  return {
    imageConfig: Object.keys(contentCopy).reduce((acc, viewportKey) => {
      const viewport = contentCopy[viewportKey];
      const contentPath = routeImporter.addImport(ImportAggregator.relativePath(viewport));
      acc.push({
        viewport: viewportKey,
        contentPath,
      });
      return acc;
    }, []),
  };
};

/**
 * Sets up content route item. All content items are wrapped with the content wrapper.
 */
const contentRouteItem = (name, routePath, { contentPath, importName, identifier }, props, type, routeImporter) => {
  const contentProps = { props };
  let content = { contentPath: ContentWrapper, importName: 'ContentWrapper' };

  if (type === 'md' || type === 'mdx') {
    content = { contentPath: MarkdownWrapper, importName: 'MarkdownWrapper' };
  }

  if (type === 'evidence') {
    contentProps.content = routeImporter.addReactLazyImport(TerraScreenshotWrapper);
    contentProps.props = evidenceProps(contentPath, routeImporter);
  } else {
    contentProps.content = routeImporter.addReactLazyImport(ImportAggregator.relativePath(contentPath), importName, identifier);
  }

  return routeItem(
    name,
    routePath,
    content,
    contentProps,
    routeImporter,
  );
};

/**
 * Sets up a redirect route item. This redirects to another page.
 */
const redirectRouteItem = (name, routePath, redirectPath, routeImporter) => (
  routeItem(
    name,
    routePath,
    { contentPath: 'react-router-dom', importName: '{ Redirect }', identifier: 'Redirect' },
    { to: redirectPath },
    routeImporter,
  )
);

/**
 * Adds an alias and a 'source' alias if not in prod mode and hot reloading is enabled.
 */
const getPageContentConfig = (config, rootPath, routeImporter) => config.reduce((acc, page) => {
  let { content } = acc;
  const menuItems = acc.menuItems || [];
  const hasSubMenu = page.pages && page.pages.length > 0;
  const firstItemsHasSubMenu = hasSubMenu && page.pages[0].pages;
  const subMenuHasMoreThanOneItem = hasSubMenu && page.pages.length > 1;
  const isRootItem = !rootPath;

  const routePath = `${rootPath}${page.path}`;
  let descendantMenuItems;

  // If the given page, has sub menu items, add them to the overall route object.
  if (hasSubMenu) {
    // Recursively call to get child content, and menu items
    const { content: childContent, menuItems: childMenuItems } = getPageContentConfig(page.pages, routePath, routeImporter);

    content = Object.assign(content, childContent);
    descendantMenuItems = childMenuItems;
  }

  if (!isRootItem || firstItemsHasSubMenu || subMenuHasMoreThanOneItem) {
    // Provide the menu item for this content page.
    menuItems.push(menuItem(page.name, routePath, hasSubMenu, descendantMenuItems));
  }

  if (page.content) {
    content[routePath] = contentRouteItem(page.name, routePath, { contentPath: page.content }, page.props, page.type, routeImporter);
  } else if (isRootItem && !firstItemsHasSubMenu && hasSubMenu) {
    content[routePath] = redirectRouteItem(page.name, routePath, descendantMenuItems[0].path, routeImporter);
  }

  return { content, menuItems };
}, { content: {}, menuItems: [] });

/**
* Create a page config object for the top level page.
*/
const getPageConfig = (name, pagePath, pages, type, siteConfig) => {
  const { readMeContent } = siteConfig;
  const config = {
    name: startCase(name),
    path: pagePath,
    pages,
  };

  // Special logic to add a home component with a readme if readme content is provided in site config and no other home items are found.
  if (type === 'home' && readMeContent) {
    config.content = readMeContent;
    config.type = 'md';
  }

  return config;
};

/**
* Build out the page config for the top level link.
*/
const getLinkPageConfig = (link, pageConfig, siteConfig, routeImporter) => {
  let pages = [];
  let type;

  // If a link has more than one type, we'll have to build out at least three page configs.
  if (link.pageTypes.length > 1) {
    // Do not sort link types. It's up to the consumer to order that array.
    pages = link.pageTypes.reduce((acc, pageType) => {
      const generatedPageConfig = getPageConfig(pageType, `/${kebabCase(pageType)}`, pageConfig[pageType], pageType, siteConfig, routeImporter);
      acc.push(generatedPageConfig);
      return acc;
    }, []);
  } else {
    // If there is only one type, just grab the first one.
    [type] = link.pageTypes;
    pages = pageConfig[type];
  }

  const generatedPageConfig = getPageConfig(link.text, link.path, pages, type, siteConfig);

  return [generatedPageConfig];
};

/**
 * Generates the content configuration used to populate the terra-dev-site navigation components.
 */
const generateContentConfig = (siteConfig, pageConfig) => {
  if (!pageConfig) {
    return undefined;
  }
  const routeImporter = new ImportAggregator();

  const { navConfig } = siteConfig;
  const { navigation } = navConfig;
  const validLinks = navigation.links ? navigation.links.filter(link => link.path && link.text && link.pageTypes) : [];

  // Spin through the valid links to build out the route config.
  const config = validLinks.reduce((acc, link) => {
    let { content, menuItems } = acc;

    // Build the 'page config' for the navigation links.
    const linkPageConfig = getLinkPageConfig(link, pageConfig, siteConfig, routeImporter);

    const { content: pageContent, menuItems: pageMenuItems } = getPageContentConfig(linkPageConfig, '', routeImporter);

    content = Object.assign(content, { [`${link.path}`]: pageContent });

    // Don't add empty page items
    if (pageMenuItems.length > 0) {
      menuItems = Object.assign(menuItems, { [`${link.path}`]: pageMenuItems });
    }

    return { content, menuItems };
  }, { content: {}, menuItems: {} });

  return {
    content: {
      config: config.content,
      imports: routeImporter,
    },
    menuItems: {
      config: config.menuItems,
    },
  };
};

module.exports = generateContentConfig;
