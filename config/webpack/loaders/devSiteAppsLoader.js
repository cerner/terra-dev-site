const template = require('lodash.template');
const { getOptions } = require('loader-utils');

/**
 * Generate the example with the supplied file.
 * Don't use an arrow function
 */
const loader = async function loader(appsTemplate) {
  const callback = this.async();

  const {
    apps,
  } = getOptions(this);

  console.log('apps', JSON.stringify(apps));

  return callback(null, template(appsTemplate)({
    apps: JSON.stringify(apps),
  }));
};

module.exports = loader;
