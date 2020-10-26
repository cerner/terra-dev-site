const template = require('lodash.template');
const { getOptions } = require('loader-utils');

const generatePagesConfig = require('../../../scripts/generate-app-config/generatePagesConfig');

/**
 * Generate the example with the supplied file.
 * Don't use an arrow function
 */
const loader = async function loader(contentTemplate) {
  const callback = this.async();

  const { siteConfig, resolveExtensions } = getOptions(this);

  const { imports, content } = generatePagesConfig(siteConfig, resolveExtensions, this.mode, false);

  return callback(null, template(contentTemplate)({
    imports,
    config: JSON.stringify(content),
  }));
};

module.exports = loader;
