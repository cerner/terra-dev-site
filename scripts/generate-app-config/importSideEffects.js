const glob = require('glob');
const path = require('path');
const ImportAggregator = require('./generation-objects/ImportAggregator');

/**
* Resolve relative paths that start with '.', then glob paths, then apply side effect imports
*/
const importSideEffects = (sideEffects, imports) => {
  sideEffects.map(sideEffectGlob => (sideEffectGlob.charAt(0) === '.' ? path.resolve('dev-site-config', sideEffectGlob) : sideEffectGlob)).reduce((acc, sideEffectGlob) => acc.concat(glob.sync(`${sideEffectGlob}?(.*)`)), []).forEach(sideEffectPath => imports.addImport(ImportAggregator.relativePath(sideEffectPath)));
};

module.exports = importSideEffects;
