const generateRoutes = (array, config, exampleType, pathRoot) => {
  config.map((componentKey) => {
    const path = componentKey.path;
    const examples = componentKey[`${exampleType}`];

    if (path && examples) {
      examples.map((example) => {
        if (example[`${exampleType}`]) {
          generateRoutes(array, examples, exampleType, pathRoot + path);
        }

        array.push({
          fullPath: pathRoot + path + example.path,
          component: example.component,
          needsPlaceholder: !example.component,
        });
        return undefined;
      });

      if (examples.length > 1) {
        array.push({
          fullPath: pathRoot + path,
          component: componentKey.component,
          needsPlaceholder: !componentKey.component,
        });
      }
    }
    return undefined;
  })
  .filter(test => !!test);

  return array;
};

const generateMenuLinks = (config, exampleType, pathRoot) => (
  config.map((componentKey) => {
    const componentPath = componentKey.path;
    const examples = componentKey[`${exampleType}`];

    if (componentPath && examples) {
      // Tests will always have create sub menu navigation
      let hasSubNav = exampleType === 'tests' || examples.length > 1;
      examples.forEach((example) => {
        if (example[`${exampleType}`] && example[`${exampleType}`].length > 1) {
          hasSubNav = true;
        }
      });

      let path = `${pathRoot}${componentPath}`;
      if (!hasSubNav) {
        path = `${pathRoot}${componentPath}${examples[0].path}`;
      }

      return ({
        id: pathRoot + componentPath,
        path,
        text: componentKey.name,
        hasSubNav,
      });
    }

    return undefined;
  })
  .filter(example => !!example)
);

const generateSubMenuLinks = (componentConfig, exampleType, pathRoot) => (
  componentConfig[`${exampleType}`].map((example) => {
    let path = `${pathRoot}${example.path}`;
    if (exampleType !== 'tests' && example[`${exampleType}`] && example[`${exampleType}`].length === 1) {
      path = `${pathRoot}${example.path}${example[`${exampleType}`][0].path}`;
    }

    return {
      id: path,
      path: `${path}`,
      text: example.name,
      hasSubNav: !!example[`${exampleType}`],
    };
  })
);

const ComponentsUtils = {
  generateMenuLinks,
  generateSubMenuLinks,
  generateRoutes,
};

export default ComponentsUtils;
