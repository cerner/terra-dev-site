const ImportAggregator = require('./generation-objects/ImportAggregator');

const RoutingMenu = 'terra-application-layout/lib/menu/RoutingMenu';
// const Components = 'terra-dev-site/lib/app/components/Components';
const Placeholder = 'terra-dev-site/lib/app/common/Placeholder';
const Home = 'terra-dev-site/lib/app/components/Home';
const path = require('path');

// const buildComponent = (Component, configuredProps) => (
//   {
//     default: {
//       componentClass: Component,
//       props: configuredProps,
//     },
//   }
// );

// const buildMenuConfig = (component, menuComponent, pageType, pathRoot = '') => {
//   let generatedConfig = {};
//   const routePath = pathRoot + component.path;
//   const pages = (component.pages || {})[pageType];

//   if (pages) {
//     // create menu items to add to this menu
//     const menuItems = pages.map((subComponent) => {
//       const { generatedConfig: subMenu, alternatePath } = buildMenuConfig(subComponent, menuComponent, pageType, routePath);
//       const subComponentPath = routePath + subComponent.path;
//       // add any generated menus to the overall config
//       if (subMenu) {
//         generatedConfig = Object.assign(generatedConfig, subMenu);
//       }
//       return {
//         text: subComponent.name,
//         path: alternatePath !== undefined ? alternatePath : subComponentPath,
//         hasSubMenu: subMenu !== undefined,
//       };
//     });

//     // Do not create a submenu for the component if the component has one site page with no additional sub-nav and it's not a test route.
//     if (menuItems.length === 1 && (pages[0].pages || {})[pageType] === undefined && pageType !== 'tests') {
//       return { generatedConfig: undefined, alternatePath: menuItems[0].path };
//     }

//     const componentMenuProps = { title: component.name, menuItems };
//     generatedConfig[routePath] = {
//       path: routePath,
//       component: buildComponent(menuComponent, componentMenuProps),
//     };

//     return { generatedConfig, alternatePath: undefined };
//   }

//   return { generatedConfig: undefined, alternatePath: undefined };
// };

// const buildLinksMenuConfig = (componentConfig, link, routeImporter) => {
//   // build content configuration
//   // If there is a custom menu item, use that.
//   let menuComponent = routeImporter.addImport(RoutingMenu);
//   if (link.menuComponent) {
//     menuComponent = link.menuComponent;
//   }

//   const component = {
//     name: link.text,
//     path: '',
//     pages: { [link.pageType]: Object.values(componentConfig).filter(item => item.pages[link.pageType] !== undefined) },
//   };

//   // Manipulate the link config to build out the first level menu item.
//   const { generatedConfig } = buildMenuConfig(
//     component,
//     menuComponent,
//     link.pageType,
//     link.path,
//   );

//   return generatedConfig;
// };

const relativePath = (componentPath) => {
  if (componentPath[0] === '.') {
    return path.relative(
      path.join(process.cwd(), 'dev-site-config', 'build'),
      path.resolve(process.cwd(), 'dev-site-config', componentPath),
    );
  }

  return componentPath;
};

// const updateConfigWithImports = (componentConfig, routeImporter) => (

//   componentConfig.map((config) => {
//     const { name, path: url, component } = config;
//     const { [pageType]: page } = config.pages;
//     const updatedConfig = { name, path: url };

//     if (page) {
//       updatedConfig.pages = { [pageType]: updateConfigWithImports(page, pageType, routeImporter) };
//     }

//     if (component) {
//       const componentPath = relativePath(component);
//       updatedConfig.component = routeImporter.addImport(componentPath);
//     }

//     return updatedConfig;
//   })
// );

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

const recur = (config, rootPath, routeImporter) => (
  Object.values(config).reduce((acc, page) => {
    console.log('page', page);
    let content = acc.content;
    let menu = acc.menu;
    const menuItems = acc.menuItems || [];
    const hasSubMenu = page.pages && Object.keys(page.pages).length > 0;

    const routePath = `${rootPath}${page.path}`;
    if (hasSubMenu) {
      const { content: childContent, menu: childMenu, menuItems: childMenuItems } = recur(page.pages, routePath, routeImporter);

      content = Object.assign(content, childContent);
      menu = Object.assign(menu, childMenu);
      console.log('page', page);

      menu[routePath] = routeItem(routePath, RoutingMenu, menuProps(page.name, childMenuItems), routeImporter);
    }

    menuItems.push(menuItem(page.name, routePath, hasSubMenu));

    console.log('menuItems', menuItems);

    if (page.component) {
      content[routePath] = routeItem(routePath, page.component, page.props, routeImporter);
    }

    // console.log('menu', menu);
    return { content, menu, menuItems };
  }, { content: {}, menu: {} })

  // return{ content, menu };
);

const getLinkRoute = (link, pageConfig, siteConfig, routeImporter) => {
  const { placeholderSrc, readMeContent } = siteConfig;

  const linkRoute = {
    name: link.text,
    path: link.path,
    pages: pageConfig[link.pageType],
    component: Placeholder,
    props: { src: placeholderSrc },
  };

  // Special logic to add a home component with a readme if readme content is provided in site config and no other home items are found.
  if (link.pageType === 'home' && readMeContent) {
    linkRoute.component = Home;
    linkRoute.props = { readMeContent: routeImporter.addImport(relativePath(readMeContent)) };
  }

  return { [link.pageType]: linkRoute };
};


const routeConfiguration = (siteConfig, pageConfig) => {
  if (!pageConfig) {
    return undefined;
  }
  const routeImporter = new ImportAggregator();
  // const { placeholderSrc, readMeContent } = siteConfig;
  const navigation = siteConfig.navConfig.navigation;
  const validLinks = navigation.links ? navigation.links.filter(link => link.path && link.text && link.pageType) : [];

  const config = validLinks.reduce((acc, link) => {
    let content = acc.content;
    let menu = acc.menu;
    const linkRoute = getLinkRoute(link, pageConfig, siteConfig, routeImporter);

    const { content: linkContent, menu: linkMenu } = recur(linkRoute, '', routeImporter);

    content = Object.assign(content, linkContent);
    menu = Object.assign(menu, linkMenu);

    return { menu, content };
  }, { content: {}, menu: {} });

  // let content = {};
  // let menu = {};

  // Object.entries(pageConfig).forEach(([type, route]) => {
  //   const linkPath = types[type];
  //   if (linkPath) {
  //     const { content: linkContent, menu: linkMenu } = recur(route, linkPath, routeImporter);

  //     content = Object.assign(content, linkContent);
  //     menu = Object.assign(menu, linkMenu);
  //   }
  // });

  console.log('content', JSON.stringify(config.content, null, 2));
  console.log('menu', JSON.stringify(config.menu, null, 2));

  return {
    config,
    imports: routeImporter,
  };
};


// const routeConfiguration = (siteConfig, componentConfig) => {
//   if (!componentConfig) {
//     return undefined;
//   }

//   const routeImporter = new ImportAggregator();
//   const { navConfig, placeholderSrc, readMeContent } = siteConfig;

//   const navigation = navConfig.navigation;

//   const content = {};
//   let menu = {};

//   const validLinks = navigation.links ? navigation.links.filter(link => link.path && link.text && link.pageType) : [];

//   validLinks.forEach((link) => {
//     const pageType = link.pageType;

//     const updatedComponentConfig = updateConfigWithImports(Object.values(componentConfig), pageType, routeImporter);

//     // build content configuration
//     let contentComponent = routeImporter.addImport(link.component ? link.component : Components);
//     let componentProps = { config: Object.values(updatedComponentConfig), pathRoot: link.path, pageType, placeholderSrc };
//     if (pageType === 'home' && !link.component) {
//       contentComponent = routeImporter.addImport(Home);
//       componentProps = { readMeContent: routeImporter.addImport(relativePath(readMeContent), 'readMe') };
//     }

//     content[link.path] = {
//       path: link.path,
//       component: buildComponent(contentComponent, componentProps),
//     };

//     if (link.hasSubNav) {
//       menu = Object.assign(menu, buildLinksMenuConfig(updatedComponentConfig, link, routeImporter));
//     }
//   });

//   const routeConfig = { content, menu };

//   return {
//     config: routeConfig,
//     imports: routeImporter,
//   };
// };

module.exports = routeConfiguration;
