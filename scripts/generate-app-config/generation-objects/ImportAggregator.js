const IdentifierPlaceholder = require('./IdentifierPlaceholder');
const path = require('path');

/**
* This class aggregates imports and helps insure things are not included more than once.
*/
class ImportAggregator {
  constructor() {
    this.imports = {};
  }

  /**
  * Imports are aggregaged and only added once. Name and identifier are optional.
  * Import name from <filepath>
  * returns the identifier specifed or the name.
  */
  addImport(filePath, name, identifier) {
    if (!this.imports[filePath]) {
      const componentName = name || `Component${Object.keys(this.imports).length + 1}`;
      this.imports[filePath] = componentName;
    }

    const ident = identifier || this.imports[filePath];

    return new IdentifierPlaceholder(ident);
  }

  /**
  * Returns a string of all the code imports.
  */
  toCodeString() {
    return Object.keys(this.imports).reduce((acc, cur) => `${acc} import ${this.imports[cur]} from '${cur.replace(/\\/g, '\\\\')}';\n`, '');
  }

  /**
  * This provides a relative path from dev-site-config to the dev-site-config-build folder
  */
  static relativePath(contentPath) {
    if (contentPath[0] === '.') {
      return path.relative(
        path.join(process.cwd(), 'dev-site-config', 'build'),
        path.resolve(process.cwd(), 'dev-site-config', contentPath),
      );
    }

    return contentPath;
  }
}

module.exports = ImportAggregator;
