const generateRoutes = (array, config, exampleType, pathRoot, isfirstPass = true) => {
  config.map((componentKey) => {
    const componentPath = componentKey.path;
    const examples = componentKey[`${exampleType}`];

    if (!componentPath) {
      return undefined;
    }
    const path = pathRoot + componentPath;

    if (examples) {
      examples.map((example) => {
        if (example[`${exampleType}`]) {
          generateRoutes(array, examples, exampleType, path, false);
        }

        array.push({
          fullPath: path + example.path,
          component: example.component,
          needsPlaceholder: !example.component,
        });
        return undefined;
      });
    }

    if (isfirstPass) {
      array.push({
        fullPath: path,
        component: componentKey.component,
        needsPlaceholder: !componentKey.component,
      });
    }
    return undefined;
  })
  .filter(example => !!example);

  return array;
};

const generateMenuLinks = (config, exampleType, pathRoot) => (
  config.map((componentKey) => {
    const componentPath = componentKey.path;
    const examples = componentKey[`${exampleType}`];

    if (!componentPath || (!examples && !componentKey.component)) {
      return undefined;
    }
    let path = `${pathRoot}${componentPath}`;
    let hasSubNav = false;

    if (examples) {
      // Tests will always have create sub menu navigation
      hasSubNav = exampleType === 'tests' || examples.length > 1;

      // Check if there is more than one layer deep of sub nav
      examples.forEach((example) => {
        if (example[`${exampleType}`] && example[`${exampleType}`].length > 1) {
          hasSubNav = true;
        }
      });

      if (!hasSubNav) {
        path = `${path}${examples[0].path}`;
      }
    }

    return ({
      id: pathRoot + componentPath,
      path,
      text: componentKey.name,
      hasSubNav,
    });
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
