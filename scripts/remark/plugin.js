/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');
const visit = require('unist-util-visit');

module.exports = () => (tree, file) => {
  visit(tree, 'code', node => {
    if (node.meta) {
      console.log('node', node);
      const tags = node.meta.split(' ');
      const filePath = tags[0].split(':')[1];
      console.log('filePathA', filePath);
      let resolvedPath = '';
      if (filePath.startsWith('.')) {
        resolvedPath = path.resolve(file.dirname, filePath);
      } else {
        resolvedPath = require.resolve(filePath);
      }

      console.log('resolved path', resolvedPath);
      node.value = fs.readFileSync(resolvedPath);
    }
  });
};
