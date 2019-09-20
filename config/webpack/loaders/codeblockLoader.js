// const { getOptions } = require('loader-utils');
const path = require('path');

const loader = async function loader(content) {
  // console.log('mdx loader content', content);
  const callback = this.async();
  // remove . from extension;
  const extension = path.extname(this.resourcePath).slice(1);
  return callback(null, `\`\`\`${extension}\n${content}\n\`\`\``);
};

module.exports = loader;
