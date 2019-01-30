const kebabCase = require('lodash.kebabcase');
const startCase = require('lodash.startcase');
const ImportAggregator = require('./generation-objects/ImportAggregator');

// "require" items to be added to the generated config.
const RoutingMenu = 'terra-application-layout/lib/menu/RoutingMenu';
const ContentWrapper = 'terra-dev-site/lib/app/components/ContentWrapper';
const PlaceholderPath = 'terra-dev-site/lib/app/common/Placeholder';
const TerraDocTemplate = 'terra-doc-template';
const Redirect = 'react-router-dom';
const TerraScreenshotWrapper = 'terra-dev-site/lib/app/components/ScreenshotWrapper';

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
 * Setup props for a route menu.
 */
const menuProps = (title, menuItems) => ({
  title,
  menuItems,
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
 * Create the route item for the placeholder component.
 */
const placeholderRouteItem = (routePath, placeholder, routeImporter) => contentRouteItem(
  routePath,
  {
    contentPath: placeholder.content,
    name: 'TerraDevSitePlaceholder',
  },
  placeholder.props,
  'js',
  routeImporter,
);

/**
 * Create the route item to redirect to.
 */
const redirectRouteItem = (routePath, redirectRoute, routeImporter) => contentRouteItem(
  routePath,
  {
    contentPath: Redirect,
    name: '{ Redirect }',
    identifier: 'Redirect',
  },
  { to: redirectRoute },
  'js',
  routeImporter,
);

/**
 * Create the route item to redirect to.
 * We specifically do not want to auto redirect for the tiny form factor,
 * so function this sets the tiny config to the placeholder
 */
const flexibleRedirectRouteItem = (routePath, placeholder, redirectRoute, routeImporter) => {
  const redirectRouteInstance = redirectRouteItem(routePath, redirectRoute, routeImporter);
  const placeholderRouteInstance = placeholderRouteItem(routePath, placeholder, routeImporter);
  // Pull the default generated placeholder config and set it on the tiny key for the redirect route item.
  redirectRouteInstance.component.tiny = placeholderRouteInstance.component.default;
  return redirectRouteInstance;
};

/**
 * Add's an alias and a 'source' alias if not in prod mode and hot reloading is enabled.
 */
const generateRouteConfig = (config, rootPath, placeholder, routeImporter) => config.reduce((acc, page) => {
  let { content, menu } = acc;
  const menuItems = acc.menuItems || [];
  const hasSubMenu = page.pages && page.pages.length > 0;

  const routePath = `${rootPath}${page.path}`;
  let redirectRoute;
  let contentHasMenu;
  let descendantMenuItems;

  // If the given page, has sub menu items, add them to the overall route object.
  if (hasSubMenu) {
    // Recursively call to get child content, and menu items
    const { content: childContent, menu: childMenu, menuItems: childMenuItems } = generateRouteConfig(page.pages, routePath, placeholder, routeImporter);

    content = Object.assign(content, childContent);
    menu = Object.assign(menu, childMenu);
    descendantMenuItems = childMenuItems;

    // If the page does not have content, but the first submenu item has content, but not a menu. Redirect directly to that item.
    const subPage = page.pages[0];
    if (subPage.content && !subPage.pages && !page.content) {
      redirectRoute = `${rootPath}${page.path}${subPage.path}`;
    }

    // If we have a redirect route and only one item in the menu, lets skip adding the menu.
    contentHasMenu = !redirectRoute || childMenuItems.length > 1;
    if (contentHasMenu) {
      // Add a menu item containing links to the child content.
      menu[routePath] = routeItem(routePath, { contentPath: RoutingMenu, name: 'RoutingMenu' }, menuProps(page.name, childMenuItems), routeImporter);
    }
  }

  // Provide the menu item for this content page.
  menuItems.push(menuItem(page.name, routePath, hasSubMenu, descendantMenuItems));

  // If the pages has content, add the content render item. If not, add a placeholder item.
  if (page.content) {
    content[routePath] = contentRouteItem(routePath, { contentPath: page.content }, page.props, page.type, routeImporter);
  }

  return { content, menu, menuItems };
}, { content: {}, menu: {} });

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
    // Do no sort link types. It's up to the consumer to order that array.
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
* Build out route configuration and modify the navigation items config too.
*/
const contentConfiguration = (siteConfig, pageConfig) => {
  if (!pageConfig) {
    return undefined;
  }
  const routeImporter = new ImportAggregator();
  const { placeholderSrc, navConfig } = siteConfig;
  const { navigation } = navConfig;
  const validLinks = navigation.links ? navigation.links.filter(link => link.path && link.text && link.pageTypes) : [];

  // Setup the placeholder object.
  const placeholderImage = routeImporter.addImport(placeholderSrc, 'placeholderSrc');
  const placeholder = { content: PlaceholderPath, props: { src: placeholderImage } };

  debugger;

  // Spin through the valid links to build out the route config.
  const config = validLinks.reduce((acc, link) => {
    let { content, menuItems } = acc;

    // Build the 'page config' for the navigation links.
    const linkPageConfig = getLinkPageConfig(link, pageConfig, siteConfig, routeImporter);

    const { content: linkContent, menuItems: linkMenuItems } = generateRouteConfig(linkPageConfig, '', placeholder, routeImporter);

    content = Object.assign(content, { [`${link.path}`]: linkContent });
    menuItems = Object.assign(menuItems, { [`${link.path}`]: linkMenuItems });

    return { content, menuItems };
  }, { content: {}, menuItems: {} });

  return {
    config,
    imports: routeImporter,
  };
};


module.exports = contentConfiguration;
