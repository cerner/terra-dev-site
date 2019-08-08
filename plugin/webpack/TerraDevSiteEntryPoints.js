const path = require('path');

module.exports = {
  'terra-dev-site': path.resolve(path.join(__dirname, '..', '..', 'lib', 'Index')),
  rewriteHistory: path.resolve(path.join(__dirname, '..', '..', 'lib', 'rewriteHistory')),
  redirect: path.resolve(path.join(__dirname, '..', '..', 'lib', 'redirect')),
};
