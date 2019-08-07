const path = require('path');
const glob = require('glob');

/**
 * This plugin is intended to facilitate switching between a source directory
 * and a transpiled distribution directory.
 */
class DirectorySwitcherPlugin {
  constructor({
    shouldSwitch = true, source = 'src', distribution = 'lib', rootDirectories = [process.cwd()],
  } = {}) {
    this.shouldSwitch = shouldSwitch;
    this.dirs = rootDirectories.reduce(
      // expand glob for the source directory, if not found don't switch.
      (acc, root) => acc.concat(glob.sync(path.join(root, source)).map(
        sourcePath => ({
          distribution: path.join(path.dirname(sourcePath), distribution),
          source: sourcePath,
        }),
      )),
      [],
    );
  }

  apply(resolver) {
    if (this.shouldSwitch) {
      const hook = resolver.ensureHook('described-relative');
      resolver.getHook('described-relative')
        .tapAsync('MyResolverPlugin', (request, resolveContext, callback) => {
          // Look for paths starting with one of the paths to swap
          const index = this.dirs.findIndex(pairs => request.path.startsWith(pairs.distribution));
          if (index >= 0) {
            const { distribution, source } = this.dirs[index];
            const remainingRequest = request.path.substr(distribution.length);
            const newPathStr = source + remainingRequest;
            const obj = {
              ...request,
              path: newPathStr,
            };
            // After changing the path call back into the same hook to continue resolution.
            return resolver.doResolve(hook, obj, `Switched ${request.path} to ${obj.path}`, resolveContext, callback);
          }
          return callback();
        });
    }
  }
}

module.exports = DirectorySwitcherPlugin;
