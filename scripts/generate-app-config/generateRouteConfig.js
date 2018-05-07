const ImportAggregator = require('./generation-objects/ImportAggregator');

const RoutingMenu = 'terra-application-layout/lib/menu/RoutingMenu';
const Components = 'terra-dev-site/lib/app/components/Components';
const Home = 'terra-dev-site/lib/app/components/Home';
const path = require('path');

const buildComponent = (Component, configuredProps) => (
  {
    default: {
      componentClass: Component,
      props: configuredProps,
    },
  }
);

const buildMenuConfig = (component, menuComponent, pageType, pathRoot = '') => {
  let generatedConfig = {};
  const routePath = pathRoot + component.path;
  const pages = (component.pages || {})[pageType];

  if (pages) {
    // create menu items to add to this menu
    const menuItems = pages.map((subComponent) => {
      const { generatedConfig: subMenu, alternatePath } = buildMenuConfig(subComponent, menuComponent, pageType, routePath);
      const subComponentPath = routePath + subComponent.path;
      // add any generated menus to the overall config
      if (subMenu) {
        generatedConfig = Object.assign(generatedConfig, subMenu);
      }
      return {
        text: subComponent.name,
        path: alternatePath !== undefined ? alternatePath : subComponentPath,
        hasSubMenu: subMenu !== undefined,
      };
    });

    // Do not create a submenu for the component if the component has one site page with no additional sub-nav and it's not a test route.
    if (menuItems.length === 1 && (pages[0].pages || {})[pageType] === undefined && pageType !== 'tests') {
      return { generatedConfig: undefined, alternatePath: menuItems[0].path };
    }

    const componentMenuProps = { title: component.name, menuItems };
    generatedConfig[routePath] = {
      path: routePath,
      component: buildComponent(menuComponent, componentMenuProps),
    };

    return { generatedConfig, alternatePath: undefined };
  }

  return { generatedConfig: undefined, alternatePath: undefined };
};

const buildLinksMenuConfig = (componentConfig, link, routeImporter) => {
  // build content configuration
  // If there is a custom menu item, use that.
  let menuComponent = routeImporter.addImport(RoutingMenu);
  if (link.menuComponent) {
    menuComponent = link.menuComponent;
  }

  const component = {
    name: link.text,
    path: '',
    pages: { [link.pageType]: Object.values(componentConfig).filter(item => item.pages[link.pageType] !== undefined) },
  };

  // Manipulate the link config to build out the first level menu item.
  const { generatedConfig } = buildMenuConfig(
    component,
    menuComponent,
    link.pageType,
    link.path,
  );

  return generatedConfig;
};

const relativePath = componentPath => (path.relative(path.join(process.cwd(), 'dev-site-config', 'build'), path.resolve(process.cwd(), 'dev-site-config', componentPath)));

const updateConfigWithImports = (componentConfig, pageType, routeImporter) => (

  componentConfig.map((config) => {
    const { name, path: url, component } = config;
    const { [pageType]: page } = config.pages;
    const updatedConfig = { name, path: url };

    if (page) {
      updatedConfig.pages = { [pageType]: updateConfigWithImports(page, pageType, routeImporter) };
    }

    if (component) {
      const componentPath = relativePath(component);
      updatedConfig.component = routeImporter.addImport(componentPath);
    }

    return updatedConfig;
  })
);

const routeConfiguration = (siteConfig, componentConfig) => {
  if (!componentConfig) {
    return undefined;
  }

  const routeImporter = new ImportAggregator();
  const { navConfig, placeholderSrc, readMeContent } = siteConfig;

  const navigation = navConfig.navigation;

  const content = {};
  let menu = {};

  const validLinks = navigation.links ? navigation.links.filter(link => link.path && link.text && link.pageType) : [];

  validLinks.forEach((link) => {
    const pageType = link.pageType;

    const updatedComponentConfig = updateConfigWithImports(Object.values(componentConfig), pageType, routeImporter);

    // build content configuration
    let contentComponent = routeImporter.addImport(link.component ? link.component : Components);
    let componentProps = { config: Object.values(updatedComponentConfig), pathRoot: link.path, pageType, placeholderSrc };
    if (pageType === 'home' && !link.component) {
      contentComponent = routeImporter.addImport(Home);
      componentProps = { readMeContent: routeImporter.addImport(relativePath(readMeContent), 'readMe') };
    }

    content[link.path] = {
      path: link.path,
      component: buildComponent(contentComponent, componentProps),
    };

    if (link.hasSubNav) {
      menu = Object.assign(menu, buildLinksMenuConfig(updatedComponentConfig, link, routeImporter));
    }
  });

  const routeConfig = { content, menu };

  return {
    config: routeConfig,
    imports: routeImporter,
  };
};

module.exports = routeConfiguration;
