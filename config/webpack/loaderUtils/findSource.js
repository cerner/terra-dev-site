const path = require('path');

module.exports = (filePath) => {
  const modifiedPath = filePath.replace('/lib/', '/src/');
  const parsedResourcePath = path.parse(modifiedPath);
  return {
    filePath: modifiedPath,
    source: path.join(parsedResourcePath.dir, parsedResourcePath.name),
    name: parsedResourcePath.name,
    // remove . from extension;
    extension: parsedResourcePath.ext.slice(1),
  };
};
