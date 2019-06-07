const path = require('path');
const IdentifierPlaceholder = require('./IdentifierPlaceholder');

/**
* This class aggregates imports and helps insure things are not included more than once.
*/
class ImportAggregator {
  static internalAddImport(filePath, name, identifier, imports) {
    if (!imports[filePath]) {
      // eslint-disable-next-line no-param-reassign
      imports[filePath] = name;
    }

    const ident = identifier || imports[filePath];

    return new IdentifierPlaceholder(ident);
  }

  constructor() {
    this.imports = {};
    this.dynamicImports = {};
  }

  /**
  * Imports are aggregaged and only added once. Name and identifier are optional.
  * Import name from <filepath>
  * returns the identifier specifed or the name.
  */
  addImport(filePath, name, identifier) {
    const componentName = name || `Component${Object.keys(this.imports).length + 1}`;
    return ImportAggregator.internalAddImport(filePath, componentName, identifier, this.imports);
  }

  addDynamicImport(filePath, name, identifier) {
    const componentName = name || `DynamicComponent${Object.keys(this.dynamicImports).length + 1}`;
    return ImportAggregator.internalAddImport(filePath, componentName, identifier, this.dynamicImports);
  }

  /**
  * Returns a string of all the code imports.
  */
  toCodeString() {
    const imports = Object.keys(this.imports).reduce((acc, cur) => (
      `${acc} import ${this.imports[cur]} from '${cur.replace(/\\/g, '\\\\')}';\n`
    ), '');
    const dynamicImports = Object.keys(this.dynamicImports).reduce((acc, cur) => (
      `${acc} const  ${this.dynamicImports[cur]} = () => import('${cur.replace(/\\/g, '\\\\')}');\n`
    ), '');
    return imports + dynamicImports;
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
