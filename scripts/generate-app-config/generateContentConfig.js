const kebabCase = require('lodash.kebabcase');
const startCase = require('lodash.startcase');
const ImportAggregator = require('./generation-objects/ImportAggregator');

// "require" items to be added to the generated config.
const TerraDocTemplate = 'terra-doc-template';
const ContentWrapper = 'terra-dev-site/lib/wrappers/_ContentWrapper';
const TerraScreenshotWrapper = 'terra-dev-site/lib/wrappers/_ScreenshotWrapper';

/**
* Setup a menuItem object.
*/
const menuItem = (text, itemPath, hasSubMenu, childItems) => ({
  text,
  path: itemPath,
  childItems,
  ...(hasSubMenu) && { hasSubMenu: true },
});

/**
 * Builds out a route item. Adds the props object conditionally.
 */
const routeItem = (routePath, { contentPath, name }, props, routeImporter) => ({
  path: routePath,
  component: {
    default: {
      componentClass: routeImporter.addImport(ImportAggregator.relativePath(contentPath), name),
      ...(props) && { props },
    },
  },
});

const evidenceProps = (contentConfig, routeImporter) => {
  const contentCopy = Object.assign({}, contentConfig);
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
const contentRouteItem = (routePath, { contentPath, name, identifier }, props, type, routeImporter) => {
  let relativeContent;
  let contentProps;
  if (typeof contentPath === 'string') {
    relativeContent = routeImporter.addImport(ImportAggregator.relativePath(contentPath), name, identifier);
    contentProps = {
      content: relativeContent,
      props,
    };
  }

  // If the type is md, we want to further wrap the file in a terra-doc-template, to render the markdown.
  if (type === 'md') {
    contentProps = {
      content: routeImporter.addImport(TerraDocTemplate),
      props: {
        readme: relativeContent,
      },
    };
  }

  if (type === 'evidence') {
    contentProps = {
      content: routeImporter.addImport(TerraScreenshotWrapper),
      props: evidenceProps(contentPath, routeImporter),
    };
  }

  return routeItem(
    routePath,
    { contentPath: ContentWrapper, name: 'ContentWrapper' },
    contentProps,
    routeImporter,
  );
};

/**
 * Add's an alias and a 'source' alias if not in prod mode and hot reloading is enabled.
 */
const getPageContentConfig = (config, rootPath, routeImporter) => config.reduce((acc, page) => {
  let { content } = acc;
  const menuItems = acc.menuItems || [];
  const hasSubMenu = page.pages && page.pages.length > 0;

  const routePath = `${rootPath}${page.path}`;
  let descendantMenuItems;

  // If the given page, has sub menu items, add them to the overall route object.
  if (hasSubMenu) {
    // Recursively call to get child content, and menu items
    const { content: childContent, menuItems: childMenuItems } = getPageContentConfig(page.pages, routePath, routeImporter);

    content = Object.assign(content, childContent);
    descendantMenuItems = childMenuItems;
  }

  // Provide the menu item for this content page.
  menuItems.push(menuItem(page.name, routePath, hasSubMenu, descendantMenuItems));

  if (page.content) {
    content[routePath] = contentRouteItem(routePath, { contentPath: page.content }, page.props, page.type, routeImporter);
  }

  return { content, menuItems };
}, { content: {}, menuItems: [] });

/**
* Create a page config object for the top level page.
*/
const getPageConfig = (name, pagePath, pages, type, siteConfig, routeImporter) => {
  const { readMeContent } = siteConfig;
  const config = {
    name: startCase(name),
    path: pagePath,
    pages,
  };

  // Special logic to add a home component with a readme if readme content is provided in site config and no other home items are found.
  if (type === 'home' && readMeContent) {
    config.content = TerraDocTemplate;
    config.props = { readme: routeImporter.addImport(ImportAggregator.relativePath(readMeContent)) };
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

  const generatedPageConfig = getPageConfig(link.text, link.path, pages, type, siteConfig, routeImporter);

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
  const { placeholderSrc, navConfig } = siteConfig;
  const { navigation } = navConfig;
  const validLinks = navigation.links ? navigation.links.filter(link => link.path && link.text && link.pageTypes) : [];

  // Setup the placeholder object.
  const placeholderImage = routeImporter.addImport(placeholderSrc, 'placeholderSrc');

  // Spin through the valid links to build out the route config.
  const config = validLinks.reduce((acc, link) => {
    let { content, menuItems } = acc;

    // Build the 'page config' for the navigation links.
    const linkPageConfig = getLinkPageConfig(link, pageConfig, siteConfig, routeImporter);

    const { content: pageContent, menuItems: pageMenuItems } = getPageContentConfig(linkPageConfig, '', routeImporter);

    content = Object.assign(content, { [`${link.path}`]: pageContent });
    menuItems = Object.assign(menuItems, { [`${link.path}`]: pageMenuItems });

    return { content, menuItems };
  }, { content: {}, menuItems: {} });

  config.placeholderSrc = placeholderImage;

  return {
    config,
    imports: routeImporter,
  };
};

module.exports = generateContentConfig;
