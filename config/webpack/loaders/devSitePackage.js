/**
 * Generate react components based off the package.json file
 * Don't use an arrow function
 * @param {*} content the json file
 */
const loader = async function loader(content) {
  const callback = this.async();

  const json = JSON.parse(content);
  const code = [
    'import React from \'react\';',
    'import Badges from \'terra-dev-site/lib/loader-components/_Badges\';',
    '',
    `export const Badge = ({ url }) => (
      <Badges
        src="${json['terra-dev-site'] ? json['terra-dev-site'].source : ''}"
        name="${json.name}"
        version="${json.version}"
        url={url}
      />
    );`,
  ].join('\n');

  return callback(null, code);
};

module.exports = loader;
