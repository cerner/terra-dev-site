const generateRoutes = (array, config, pageType, pathRoot, isfirstPass = true) => {
  config.map((componentKey) => {
    const componentPath = componentKey.path;
    const examples = (componentKey.pages || {})[`${pageType}`];

    if (!componentPath) {
      return undefined;
    }
    const path = pathRoot + componentPath;

    if (examples) {
      examples.map((example) => {
        if ((example.pages || {})[`${pageType}`]) {
          generateRoutes(array, examples, pageType, path, false);
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

const ComponentsUtils = {
  generateRoutes,
};

export default ComponentsUtils;
