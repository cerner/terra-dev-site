import React from 'react';
import ApplicationMenu from './ApplicationMenu';
import Components from './components/Components';
import ComponentsMenu from './components/ComponentsMenu';

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

      // Do not create a submenu for the component if the component has one site page.
      if (exampleType === 'pages' && examples.length === 1 && isMainMenu) {
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
  const navigation = siteConfig.navigation;
  const placeholderSrc = siteConfig.appLogoSrc;
  const configuredLinks = [];

  const content = {};
  let menu = {};

  menu[siteConfig.rootPath] = {
    path: siteConfig.rootPath,
    component: {
      tiny: {
        componentClass: ApplicationMenu,
        props: {
          navigation,
        },
      },
      small: {
        componentClass: ApplicationMenu,
        props: {
          navigation,
        },
      },
    },
  };

  navigation.links.forEach((link) => {
    const exampleType = link.exampleType;

    // build navigation link configuration
    if (exampleType !== 'tests') {
      configuredLinks.push({
        path: link.path,
        text: link.text,
      });
    }

    // build content configuration
    let contentComponent = Components;
    if (link.component) {
      contentComponent = link.component;
    }

    const componentProps = { config: Object.values(componentConfig), pathRoot: link.path, exampleType, placeholderSrc };

    content[link.path] = {
      path: link.path,
      component: buildComponent(contentComponent, componentProps),
    };

    // build content configuration
    let menuComponent = ComponentsMenu;
    if (link.menuComponent) {
      menuComponent = link.menuComponent;
    }

    if (!link.isStatic) {
      menu = Object.assign(menu, buildNavigationConfig(componentConfig, menuComponent, exampleType, link.path));
    }
  });

  const navigationConfig = { index: navigation.index, links: configuredLinks };
  const routeConfig = { content, menu };

  return { routeConfig, navigation: navigationConfig };
};

export default routeConfiguration;
