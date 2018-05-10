const ImportAggregator = require('./generation-objects/ImportAggregator');

const RoutingMenu = 'terra-application-layout/lib/menu/RoutingMenu';
const ContentWrapper = 'terra-dev-site/lib/app/components/ContentWrapper';
const Placeholder = 'terra-dev-site/lib/app/common/Placeholder';
const Home = 'terra-dev-site/lib/app/components/Home';
const path = require('path');
const kebabCase = require('lodash.kebabcase');
const startCase = require('lodash.startcase');

const relativePath = (componentPath) => {
  if (componentPath[0] === '.') {
    return path.relative(
      path.join(process.cwd(), 'dev-site-config', 'build'),
      path.resolve(process.cwd(), 'dev-site-config', componentPath),
    );
  }

  return componentPath;
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

const routeItem = (routePath, componentPath, props, routeImporter) => {
  const item = {
    path: routePath,
    component: {
      default: {
        componentClass: routeImporter.addImport(relativePath(componentPath)),
      },
    },
  };

  if (props) {
    item.component.default.props = props;
  }

  return item;
};

const contentRouteItem = (routePath, componentPath, props, routeImporter) => (
  routeItem(
    routePath,
    ContentWrapper,
    {
      content: routeImporter.addImport(relativePath(componentPath)),
      props,
    },
    routeImporter,
  )
);

const generateRouteConfig = (config, rootPath, routeImporter) => (
  Object.values(config).reduce((acc, page) => {
    let content = acc.content;
    let menu = acc.menu;
    const menuItems = acc.menuItems || [];
    const hasSubMenu = page.pages && Object.keys(page.pages).length > 0;

    const routePath = `${rootPath}${page.path}`;
    if (hasSubMenu) {
      const { content: childContent, menu: childMenu, menuItems: childMenuItems } = generateRouteConfig(page.pages, routePath, routeImporter);

      content = Object.assign(content, childContent);
      menu = Object.assign(menu, childMenu);

      menu[routePath] = routeItem(routePath, RoutingMenu, menuProps(page.name, childMenuItems), routeImporter);
    }

    menuItems.push(menuItem(page.name, routePath, hasSubMenu));

    if (page.component) {
      content[routePath] = contentRouteItem(routePath, page.component, page.props, routeImporter);
    }

    // console.log('menu', menu);
    return { content, menu, menuItems };
  }, { content: {}, menu: {} })

  // return{ content, menu };
);

const getPageConfig = (name, pagePath, pages, type, siteConfig, routeImporter) => {
  const { placeholderSrc, readMeContent } = siteConfig;
  const config = {
    name: startCase(name),
    path: pagePath,
    pages,
    component: Placeholder,
    props: { src: placeholderSrc },
  };

  // Special logic to add a home component with a readme if readme content is provided in site config and no other home items are found.
  if (type === 'home' && readMeContent) {
    config.component = Home;
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

  return { [link.path]: getPageConfig(link.text, link.path, pages, type, siteConfig, routeImporter) };
};


const routeConfiguration = (siteConfig, pageConfig) => {
  if (!pageConfig) {
    return undefined;
  }
  const routeImporter = new ImportAggregator();
  // const { placeholderSrc, readMeContent } = siteConfig;
  const navigation = siteConfig.navConfig.navigation;
  const validLinks = navigation.links ? navigation.links.filter(link => link.path && link.text && link.pageTypes) : [];

  const config = validLinks.reduce((acc, link) => {
    let content = acc.content;
    let menu = acc.menu;
    const linkRoute = getLinkRoute(link, pageConfig, siteConfig, routeImporter);

    // console.log('linkRoute', JSON.stringify(linkRoute, null, 2));

    const { content: linkContent, menu: linkMenu } = generateRouteConfig(linkRoute, '', routeImporter);

    content = Object.assign(content, linkContent);
    menu = Object.assign(menu, linkMenu);

    return { menu, content };
  }, { content: {}, menu: {} });

  console.log('content', JSON.stringify(config.content, null, 2));
  console.log('menu', JSON.stringify(config.menu, null, 2));

  return {
    config,
    imports: routeImporter,
  };
};


module.exports = routeConfiguration;
