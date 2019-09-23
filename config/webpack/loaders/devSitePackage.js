// const { getOptions } = require('loader-utils');

// Don't use an arrow function
const loader = async function loader(content) {
  const callback = this.async();

  const json = JSON.parse(content);
  const code = [
    'import React from \'react\';',
    'import NpmBadge from \'terra-dev-site/lib/loader-components/_NpmBadge\'',
    '',
    `export const Badge = ({ url }) => (
      <NpmBadge
        name="${json.name}"
        version="${json.version}"
        url={url}
      />
    )`,
  ];

  return callback(null, code.join('\n'));
};

module.exports = loader;
