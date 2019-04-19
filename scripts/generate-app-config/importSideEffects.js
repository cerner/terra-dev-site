const glob = require('glob');
const path = require('path');
const ImportAggregator = require('./generation-objects/ImportAggregator');

/**
* Resolve relative paths that start with '.'
*/
const resolveRelativePaths = sideEffect => (sideEffect.charAt(0) === '.' ? path.resolve('dev-site-config', sideEffect) : sideEffect);

/**
* glob paths, warn if nothing is found for the glob.
*/
const globSideEffects = (acc, sideEffectGlob) => {
  const result = glob.sync(`${sideEffectGlob}?(.*)`);
  if (result.length === 0) {
    // eslint-disable-next-line no-console
    console.log(`[terra-dev-site] No Side Effect imports found at ${sideEffectGlob}`);
  }
  return acc.concat(result);
};

/**
* Resolve relative paths that start with '.', then glob paths, then apply side effect imports
*/
const importSideEffects = (sideEffects, imports) => {
  const sideEffectFiles = sideEffects.map(resolveRelativePaths).reduce(globSideEffects, []);
  sideEffectFiles.forEach(sideEffectPath => imports.addImport(ImportAggregator.relativePath(sideEffectPath)));
};

module.exports = importSideEffects;
