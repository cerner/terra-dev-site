import React from 'react';
import ApplicationMenu from './ApplicationMenu';
import Components from './components/Components';
import ComponentsMenu from './components/ComponentsMenu';
import Home from './components/Home';

const injectConfig = configuredProps => (
  Component => (
    props => (
      <Component {...props} {...configuredProps} />
    )
  )
);

const buildComponent = (Component, configuredProps) => (
  {
    default: {
      componentClass: injectConfig(configuredProps)(Component),
    },
  }
);

const buildSubNavigationConfig = (array, config, ComponentMenu, exampleType, pathRoot, isMainMenu = true) => {
  config.map((componentKey) => {
    const path = componentKey.path;
    const examples = componentKey[`${exampleType}`];

    if (path && examples) {
      examples.forEach((example) => {
        if (example[`${exampleType}`]) {
          buildSubNavigationConfig(array, examples, ComponentMenu, exampleType, pathRoot + path, false);
        }
      });

      // Do not create a submenu for the component if the component has one site page with no additional sub-nav.
      if (examples.length === 1 && isMainMenu && !examples[0][`${exampleType}`]) {
        return undefined;
      }

      const componentMenuProps = { config: componentKey, pathRoot: `${pathRoot}${path}`, exampleType, isSubMenu: true };

      array.push({
        path: `${pathRoot}${path}`,
        component: buildComponent(ComponentMenu, componentMenuProps),
      });
    }
    return undefined;
  })
  .filter(test => !!test);

  return array;
};

const buildNavigationConfig = (config, ComponentMenu, exampleType, pathRoot) => {
  const generatedConfig = {};
  const componentMenuProps = { config: Object.values(config), pathRoot, exampleType };

  generatedConfig[pathRoot] = {
    path: pathRoot,
    component: buildComponent(ComponentMenu, componentMenuProps),
  };

  const subNavConfig = buildSubNavigationConfig([], Object.values(config), ComponentMenu, exampleType, pathRoot);

  subNavConfig.forEach((test) => {
    generatedConfig[test.path] = test;
  });

  return generatedConfig;
};

const routeConfiguration = (siteConfig, componentConfig) => {
  const { navConfig, placeholderSrc, readMeContent } = siteConfig;

  const navigation = navConfig.navigation;
  const configuredLinks = [];

  const content = {};
  let menu = {};

  const validLinks = navigation.links.filter(link => link.path && link.text);

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

    // build raw test pages to maintain modular testing
    if (exampleType === 'tests') {
      const rawComponentProps = Object.assign({}, componentProps, { pathRoot: '/raw/tests' });
      content['/raw/tests'] = {
        path: '/raw/tests',
        component: buildComponent(contentComponent, rawComponentProps),
      };
    }

    // build content configuration
    let menuComponent = ComponentsMenu;
    if (link.menuComponent) {
      menuComponent = link.menuComponent;
    }

    if (link.hasSubNav) {
      menu = Object.assign(menu, buildNavigationConfig(componentConfig, menuComponent, exampleType, link.path));
    }
  });

  menu[navConfig.rootPath] = {
    path: navConfig.rootPath,
    component: {
      tiny: {
        componentClass: ApplicationMenu,
        props: {
          menuHeader: `${siteConfig.appConfig.title} ${siteConfig.appConfig.subtitle}`,
          links: configuredLinks,
        },
      },
      small: {
        componentClass: ApplicationMenu,
        props: {
          menuHeader: `${siteConfig.appConfig.title} ${siteConfig.appConfig.subtitle}`,
          links: configuredLinks,
        },
      },
    },
  };

  const navigationConfig = { index: navigation.index, links: configuredLinks };
  const routeConfig = { content, menu };

  return { routeConfig, navigation: navigationConfig };
};

export default routeConfiguration;
