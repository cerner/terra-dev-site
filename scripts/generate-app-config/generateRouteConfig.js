const ImportAggregator = require('./generation-objects/ImportAggregator');

const RoutingMenu = 'terra-application-layout/lib/menu/RoutingMenu';
const ContentWrapper = 'terra-dev-site/lib/app/components/ContentWrapper';
const PlaceholderPath = 'terra-dev-site/lib/app/common/Placeholder';
const Home = 'terra-dev-site/lib/app/components/Home';
const path = require('path');
const kebabCase = require('lodash.kebabcase');
const startCase = require('lodash.startcase');

const relativePath = (contentPath) => {
  if (contentPath[0] === '.') {
    return path.relative(
      path.join(process.cwd(), 'dev-site-config', 'build'),
      path.resolve(process.cwd(), 'dev-site-config', contentPath),
    );
  }

  return contentPath;
};

const menuItem = (text, itemPath, hasSubMenu) => {
  const item = {
    text,
    path: itemPath,
  };

  if (hasSubMenu) {
    item.hasSubMenu = true;
  }

  return item;
};

const menuProps = (title, menuItems) => ({
  title,
  menuItems,
});

const routeItem = (routePath, contentPath, props, routeImporter) => {
  const item = {
    path: routePath,
    component: {
      default: {
        componentClass: routeImporter.addImport(relativePath(contentPath)),
      },
    },
  };

  if (props) {
    item.component.default.props = props;
  }

  return item;
};

const contentRouteItem = (routePath, contentPath, props, routeImporter) => (
  routeItem(
    routePath,
    ContentWrapper,
    {
      content: routeImporter.addImport(relativePath(contentPath)),
      props,
    },
    routeImporter,
  )
);

const generateRouteConfig = (config, rootPath, placeholder, routeImporter) => (
  Object.values(config).reduce((acc, page) => {
    let content = acc.content;
    let menu = acc.menu;
    const menuItems = acc.menuItems || [];
    const hasSubMenu = page.pages && Object.keys(page.pages).length > 0;

    const routePath = `${rootPath}${page.path}`;
    let menuRoutePath = routePath;
    if (hasSubMenu) {
      const { content: childContent, menu: childMenu, menuItems: childMenuItems } = generateRouteConfig(page.pages, routePath, placeholder, routeImporter);

      content = Object.assign(content, childContent);
      menu = Object.assign(menu, childMenu);

      menu[routePath] = routeItem(routePath, RoutingMenu, menuProps(page.name, childMenuItems), routeImporter);

      // If the page does not have content, but the first submenu item only has content. Link directly to that item.
      const subPage = Object.values(page.pages)[0];
      if (subPage.content && !subPage.pages && !page.content) {
        menuRoutePath = `${rootPath}${page.path}${subPage.path}`;
      }
    }

    menuItems.push(menuItem(page.name, menuRoutePath, hasSubMenu));

    // console.log('page', page);
    if (page.content) {
      content[routePath] = contentRouteItem(routePath, page.content, page.props, routeImporter);
    } else {
      content[routePath] = contentRouteItem(routePath, placeholder.content, placeholder.props, routeImporter);
    }

    // console.log('menu', menu);
    return { content, menu, menuItems };
  }, { content: {}, menu: {} })
);

const getPageConfig = (name, pagePath, pages, type, siteConfig, routeImporter) => {
  const { readMeContent } = siteConfig;
  const config = {
    name: startCase(name),
    path: pagePath,
    pages,
  };

  // Special logic to add a home component with a readme if readme content is provided in site config and no other home items are found.
  if (type === 'home' && readMeContent) {
    config.content = Home;
    config.props = { readMeContent: routeImporter.addImport(relativePath(readMeContent)) };
  }

  return config;
};

const getLinkRoute = (link, pageConfig, siteConfig, routeImporter) => {
  let pages = {};
  let type;

  if (link.pageTypes.length > 1) {
    pages = link.pageTypes.reduce((acc, pageType) => {
      acc[pageType] = getPageConfig(pageType, `/${kebabCase(pageType)}`, pageConfig[pageType], pageType, siteConfig, routeImporter);
      return acc;
    }, {});
  } else {
    pages = pageConfig[link.pageTypes[0]];
    type = link.pageTypes[0];
  }

  const linkRoute = { [link.path]: getPageConfig(link.text, link.path, pages, type, siteConfig, routeImporter) };

  if (pages) {
    const pagesArray = Object.values(pages);
    const subPage = pagesArray[0];
    if (subPage.content && !subPage.pages) {
      // Update the link path to auto select the first item.
      // eslint-disable-next-line no-param-reassign
      link.path = `${link.path}${subPage.path}`;

      // If there is only one child item, ditch that whole menu thing.
      if (pagesArray.length === 1) {
        subPage.path = link.path;
        return { [link.path]: subPage };
      }
    }
  }

  return linkRoute;
};


const routeConfiguration = (siteConfig, pageConfig) => {
  if (!pageConfig) {
    return undefined;
  }
  const routeImporter = new ImportAggregator();
  const { placeholderSrc } = siteConfig;
  const navConfig = Object.assign({}, siteConfig.navConfig);
  // console.log('navConfig', navConfig);
  const navigation = navConfig.navigation;
  const validLinks = navigation.links ? navigation.links.filter(link => link.path && link.text && link.pageTypes) : [];
  const placeholder = { content: PlaceholderPath, props: { src: placeholderSrc } };

  const config = validLinks.reduce((acc, link) => {
    let content = acc.content;
    let menu = acc.menu;
    const linkRoute = getLinkRoute(link, pageConfig, siteConfig, routeImporter);

    // console.log('linkRoute', JSON.stringify(linkRoute, null, 2));

    const { content: linkContent, menu: linkMenu } = generateRouteConfig(linkRoute, '', placeholder, routeImporter);

    content = Object.assign(content, linkContent);
    menu = Object.assign(menu, linkMenu);

    return { menu, content };
  }, { content: {}, menu: {} });

  // console.log('content', JSON.stringify(config.content, null, 2));
  // console.log('menu', JSON.stringify(config.menu, null, 2));

  return {
    config,
    imports: routeImporter,
    navConfig,
  };
};


module.exports = routeConfiguration;
