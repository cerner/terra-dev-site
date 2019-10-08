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
    'import NpmBadge from \'terra-dev-site/lib/loader-components/_NpmBadge\';',
    '',
    `export const Badge = ({ url }) => (
      <NpmBadge
        name="${json.name}"
        version="${json.version}"
        url={url}
      />
    );`,
  ].join('\n');

  return callback(null, code);
};

module.exports = loader;
