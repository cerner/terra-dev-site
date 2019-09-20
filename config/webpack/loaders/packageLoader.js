// const { getOptions } = require('loader-utils');

// Don't use an arrow function
const loader = async function loader(content) {
  const callback = this.async();

  const json = JSON.parse(content);
  const code = [
    'import React from \'react\';',
    'import NpmBadge from \'terra-dev-site/lib/loader-components/_NpmBadge\'',
    '',
    `export const Badge = () => (<NpmBadge packageName="${json.name}" packageVersion="${json.version}" />)`,
  ];

  return callback(null, code.join('\n'));
};

module.exports = loader;
