// const { getOptions } = require('loader-utils');
const path = require('path');

/**
 * Load the contents of the file into the codeblock
 * This loader expects to be chained with the mdx loader.
 * @param {*} content
 */
const loader = async function loader(content) {
  const callback = this.async();
  // remove . from extension;
  const extension = path.extname(this.resourcePath).slice(1);

  const md = [
    `\`\`\`\`${extension}`,
    content,
    '```',
  ].join('\n');

  return callback(null, md);
};

module.exports = loader;
