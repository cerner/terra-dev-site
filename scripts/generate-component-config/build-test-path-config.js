/* Construct the test case URLs for all terra-site components
and output the test config object in the following format:
  {
    'terra-alert': [
      '/alert/alert-action-button',
      '/alert/alert-dismissible',
      '/alert/alert-responsive-to-parent',
      '/alert/alert-title',
      '/alert/alert-type',
      '/alert/custom-alert',
      '/alert/default-alert',
    ],
    'terra-arrange': [
      ...
    ],
    ...
  }
*/
const buildTestPathConfig = (componentConfig) => {
  const testConfig = {};
  Object.keys(componentConfig).forEach((key) => {
    const component = componentConfig[key];
    if (component.tests) {
      const paths = [];
      aggregateTestPath(component, paths, '');
      testConfig[key] = paths;
    }
  });
  return testConfig;
};

/* Recursively concatenate paths for each test and add them to the result array
Assume a root:
{
  'terra-alert': [
    ...
    path: /a
    tests: [
      {
        ...
        path: /b
        tests:[
          {
            ...
            path: /c
          }
          {
            ...
            path: /d
          }
        ]
      }
    ]
  ]
}
Then the final value of result would be:
[
  /a/b/c,
  /a/b/d
]
*/
const aggregateTestPath = (root, result, currentPath) => {
  const newPath = `${currentPath}${root.path.slice(1,-1)}`;
  if (!root.tests) {
    result.push(`'${newPath}'`);
    return;
  }
  root.tests.forEach((child) => {
    aggregateTestPath(child, result, newPath);
  });
};

module.exports = buildTestPathConfig;
