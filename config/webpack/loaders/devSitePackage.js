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
    'import Badges from \'terra-dev-site/lib/loader-components/_Badge\';',
    '',
    `export const Badge = ({ url }) => (
      <Badges
        code="${json.code ? json.code.url : ''}"
        name="${json.name}"
        version="${json.version}"
        url={url}
      />
    );`,
  ].join('\n');

  return callback(null, code);
};

module.exports = loader;
