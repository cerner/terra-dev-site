import RoutingMenu from 'terra-application-layout/lib/menu/RoutingMenu';
import Components from './components/Components';
import Home from './components/Home';

const buildComponent = (Component, configuredProps) => (
  {
    default: {
      componentClass: Component,
      props: configuredProps,
    },
  }
);

const buildMenuConfig = (component, menuComponent, exampleType, pathRoot = '') => {
  let generatedConfig = {};
  const path = pathRoot + component.path;
  const examples = component[exampleType];
  // console.log('compo:', component);
  // console.log('exampleType', exampleType);
  // console.log('examples', examples);

  if (examples) {
    const menuItems = examples.map((subComponent) => {
      const { generatedConfig: subMenu, alternatePath } = buildMenuConfig(subComponent, menuComponent, exampleType, path);
      const subComponentPath = path + subComponent.path;
      if (subMenu) {
        generatedConfig = Object.assign(generatedConfig, subMenu);
      }
      return {
        text: subComponent.name,
        path: alternatePath !== undefined ? alternatePath : subComponentPath,
        hasSubMenu: subMenu !== undefined,
      };
    });

    // Do not create a submenu for the component if the component has one site page with no additional sub-nav.
    if (menuItems.length === 1 && examples[0][exampleType] === undefined) {
      return { generatedConfig: undefined, alternatePath: menuItems[0].path };
    }

    const componentMenuProps = { title: component.name, menuItems };
    generatedConfig[path] = {
      path,
      component: buildComponent(menuComponent, componentMenuProps),
    };

    // console.log('inc gen config', generatedConfig);

    return { generatedConfig, alternatePath: undefined };
  }

  return { generatedConfig: undefined, alternatePath: undefined };
};

const buildLinksMenuConfig = (componentConfig, link) => {
  // build content configuration
  // If there is a custom menu item, use that.
  let menuComponent = RoutingMenu;
  if (link.menuComponent) {
    menuComponent = link.menuComponent;
  }

  // Manipulate the link config to build out the first level menu item.
  const { generatedConfig } = buildMenuConfig({
    name: link.text,
    path: '',
    [link.exampleType]: Object.values(componentConfig).filter(item => item[link.exampleType] !== undefined),
  },
  menuComponent,
  link.exampleType,
  link.path,
  );

  return generatedConfig;
};

const routeConfiguration = (siteConfig, componentConfig) => {
  console.log('IN site config:', siteConfig);
  console.log('IN componentConfig:', componentConfig);
  const { navConfig, placeholderSrc, readMeContent } = siteConfig;

  const navigation = navConfig.navigation;
  const configuredLinks = [];

  const content = {};
  let menu = {};

  const validLinks = navigation.links ? navigation.links.filter(link => link.path && link.text && link.exampleType) : [];

  validLinks.forEach((link) => {
    const exampleType = link.exampleType;

    // build navigation link configuration
    if (exampleType !== 'tests') {
      configuredLinks.push({
        path: link.path,
        text: link.text,
        hasSubNav: link.hasSubNav,
      });
    }

    // build content configuration
    let contentComponent = link.component ? link.component : Components;
    let componentProps = { config: Object.values(componentConfig), pathRoot: link.path, exampleType, placeholderSrc };
    if (exampleType === 'home' && !link.component) {
      contentComponent = Home;
      componentProps = { readMeContent };
    }

    content[link.path] = {
      path: link.path,
      component: buildComponent(contentComponent, componentProps),
    };

    if (link.hasSubNav) {
      menu = Object.assign(menu, buildLinksMenuConfig(componentConfig, link));
    }
  });

  const navigationConfig = { index: navigation.index, links: configuredLinks, extensions: navigation.extensions };
  const routeConfig = { content, menu };

  console.log('OUT Nav Config:', navigationConfig);
  console.log('OUT routeConfig', routeConfig);

  return { routeConfig, navigation: navigationConfig };
};

export default routeConfiguration;
