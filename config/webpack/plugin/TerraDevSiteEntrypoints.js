const path = require('path');

/**
 * Default entries for terra-dev-site
 */
module.exports = {
  rewriteHistory: path.resolve(path.join(__dirname, '..', '..', '..', 'lib', 'rewriteHistory')),
  redirect: path.resolve(path.join(__dirname, '..', '..', '..', 'lib', 'redirect')),
};
