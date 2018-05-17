const ImportAggregator = require('./generation-objects/ImportAggregator');
const kebabCase = require('lodash.kebabcase');
const startCase = require('lodash.startcase');

// "require" items to be added to the generated config.
const RoutingMenu = 'terra-application-layout/lib/menu/RoutingMenu';
const ContentWrapper = 'terra-dev-site/lib/app/components/ContentWrapper';
const PlaceholderPath = 'terra-dev-site/lib/app/common/Placeholder';
const TerraDocTemplate = 'terra-doc-template';
const Redirect = 'react-router-dom';

/**
* Setup a menuItem object.
*/
const menuItem = (text, itemPath, hasSubMenu) => ({
  text,
  path: itemPath,
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

/**
* Sets up content route item. All content items are wrapped with the content wrapper.
*/
const contentRouteItem = (routePath, { contentPath, name, identifier }, props, type, routeImporter) => {
  const relativeContent = routeImporter.addImport(ImportAggregator.relativePath(contentPath), name, identifier);
  let contentProps = {
    content: relativeContent,
    props,
  };

  // If the type is md, we want to further wrap the file in a terra-doc-template, to render the markdown.
  if (type === 'md') {
    contentProps = {
      content: routeImporter.addImport(TerraDocTemplate),
      props: {
        readme: relativeContent,
      },
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
const generateRouteConfig = (config, rootPath, placeholder, routeImporter) => (
  config.reduce((acc, page) => {
    let content = acc.content;
    let menu = acc.menu;
    const menuItems = acc.menuItems || [];
    const hasSubMenu = page.pages && page.pages.length > 0;

    const routePath = `${rootPath}${page.path}`;
    let redirectRoute;

    // if the given page, has sub menu items, add them to the overall route object.
    if (hasSubMenu) {
      // recursively call to get child content, and menu items
      const { content: childContent, menu: childMenu, menuItems: childMenuItems } = generateRouteConfig(page.pages, routePath, placeholder, routeImporter);

      content = Object.assign(content, childContent);
      menu = Object.assign(menu, childMenu);

      // Add a menu item containing links to the child content.
      menu[routePath] = routeItem(routePath, { contentPath: RoutingMenu, name: 'RoutingMenu' }, menuProps(page.name, childMenuItems), routeImporter);

      // If the page does not have content, but the first submenu item has content, but not a menu. Redirect directly to that item.
      const subPage = page.pages[0];
      if (subPage.content && !subPage.pages && !page.content) {
        redirectRoute = `${rootPath}${page.path}${subPage.path}`;
      }
    }

    // provide the menu item for this content page.
    menuItems.push(menuItem(page.name, routePath, hasSubMenu));

    // If the pages has content, add the content render item. If not, add a placeholder item.
    if (page.content) {
      content[routePath] = contentRouteItem(routePath, { contentPath: page.content }, page.props, page.type, routeImporter);
    } else if (redirectRoute) {
      // If a redirect Route has been identified, redirect to it.
      content[routePath] = contentRouteItem(routePath, { contentPath: Redirect, name: '{ Redirect }', identifier: 'Redirect' }, { to: redirectRoute }, 'js', routeImporter);
    } else {
      content[routePath] = contentRouteItem(routePath, { contentPath: placeholder.content, name: 'TerraDevSitePlaceholder' }, placeholder.props, 'js', routeImporter);
    }

    return { content, menu, menuItems };
  }, { content: {}, menu: {} })
);

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
      acc.push(getPageConfig(pageType, `/${kebabCase(pageType)}`, pageConfig[pageType], pageType, siteConfig, routeImporter));
      return acc;
    }, []);
  } else {
    // If there is only one type, just grab the first one.
    pages = pageConfig[link.pageTypes[0]];
    type = link.pageTypes[0];
  }

  return [getPageConfig(link.text, link.path, pages, type, siteConfig, routeImporter)];
};

/**
* Build out route configuration and modify the navigation items config too.
*/
const routeConfiguration = (siteConfig, pageConfig) => {
  if (!pageConfig) {
    return undefined;
  }
  const routeImporter = new ImportAggregator();
  const { placeholderSrc } = siteConfig;
  const navConfig = siteConfig.navConfig;
  const navigation = navConfig.navigation;
  const validLinks = navigation.links ? navigation.links.filter(link => link.path && link.text && link.pageTypes) : [];

  // Setup the placeholder object.
  const placeholderImage = routeImporter.addImport(placeholderSrc, 'placeholderSrc');
  const placeholder = { content: PlaceholderPath, props: { src: placeholderImage } };

  // Spin through the valid links to build out the route config.
  const config = validLinks.reduce((acc, link) => {
    let content = acc.content;
    let menu = acc.menu;

    // build the 'page config' for the navigation links.
    const linkPageConfig = getLinkPageConfig(link, pageConfig, siteConfig, routeImporter);

    // console.log('linkRoute', JSON.stringify(linkRoute, null, 2));

    const { content: linkContent, menu: linkMenu } = generateRouteConfig(linkPageConfig, '', placeholder, routeImporter);

    content = Object.assign(content, linkContent);
    menu = Object.assign(menu, linkMenu);

    return { menu, content };
  }, { content: {}, menu: {} });

  // console.log('content', JSON.stringify(config.content, null, 2));
  // console.log('menu', JSON.stringify(config.menu, null, 2));

  return {
    config,
    imports: routeImporter,
  };
};


module.exports = routeConfiguration;
