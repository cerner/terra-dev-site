const lodashTemplate = require('lodash.template');
const { getOptions } = require('loader-utils');

/**
 * Generate the example with the supplied file.
 * Don't use an arrow function
 */
const loader = async function loader(template) {
  const callback = this.async();

  const {
    entryPath,
    configTemplatePath,
  } = getOptions(this);

  console.log('entryPath', entryPath);
  console.log('configTemplatePath', configTemplatePath);

  return callback(null, lodashTemplate(template)({
    entryPath,
    configTemplatePath,
  }));
};

module.exports = loader;
