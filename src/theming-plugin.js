const postcss = require('postcss');
const fs = require('fs');
const path = require('path');

const sortHash = data =>
  Object.keys(data).sort().reduce((a, b) => {
    // eslint-disable-next-line no-param-reassign
    a[b] = data[b];
    return a;
  }, {});

module.exports = postcss.plugin('theming-plugin', () => {
  const variables = {};

  /**
   * Extract all terra themeable variables used in PostCSS files.
   *
   * root - Parsed PostCSS Object containing application styles.
   *
   * @returns JSON file containing all the Terra themable variables.
   */
  return function getThemedVariables(root) {
    const sourcePath = (root.source && root.source.input && root.source.input.file) || 'miscellaneous';

    let component = sourcePath;
    if (sourcePath !== 'miscellaneous') {
      const parsedPath = path.parse(sourcePath);
      component = parsedPath.name;
    }

    root.walkDecls((decl) => {
      // All of Terra's themed variables are in the syntax of var(<variable>, <value>);
      const matches = decl.value.match(/^var\(\s*(--terra[\w-]*),\s*(.*)\)/);

      if (matches) {
        variables[component] = variables[component] || {};
        [, , variables[component][matches[1]]] = matches;
      }
    });
    const processPath = process.cwd();
    /* Get the root path of a mono-repo process call */
    const rootPath = processPath.includes('packages') ? processPath.split('packages')[0] : processPath;
    return fs.writeFileSync(path.resolve(rootPath, 'themeable-variables.json'), JSON.stringify(sortHash(variables), null, 2), 'utf8');
  };
});
