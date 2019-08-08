const path = require('path');
const IdentifierPlaceholder = require('./IdentifierPlaceholder');

/**
* This class aggregates imports and helps insure things are not included more than once.
*/
class ImportAggregator {
  /**
   * Adds the import to the appropriate collection and returns the placeholder
   * @param {*} filePath filepath to the import
   * @param {*} name the string identifying the import.
   * @param {*} identifier optional identifier for the placeholder.
   * @param {*} imports the object to add the import to.
   */
  static internalAddImport(filePath, name, identifier, imports) {
    if (!imports[filePath]) {
      // eslint-disable-next-line no-param-reassign
      imports[filePath] = name;
    }

    const ident = identifier || imports[filePath];

    return new IdentifierPlaceholder(ident);
  }

  static formatString(importString) {
    return importString.replace(/\\/g, '\\\\');
  }

  constructor() {
    this.imports = {};
    this.dynamicImports = {};
    this.reactLazyImports = {};
  }

  /**
  * Imports are aggregated and only added once. Name and identifier are optional.
  * Import name from <filepath>
  * returns the identifier specified or the name.
  */
  addImport(filePath, name, identifier) {
    const componentName = name || `Component${Object.keys(this.imports).length + 1}`;
    return ImportAggregator.internalAddImport(filePath, componentName, identifier, this.imports);
  }

  /**
  * Imports are aggregated and only added once. Name and identifier are optional.
  * Import name from <filepath>
  * returns the identifier specified or the name.
  */
  addDynamicImport(filePath, name, identifier) {
    const componentName = name || `DynamicComponent${Object.keys(this.dynamicImports).length + 1}`;
    return ImportAggregator.internalAddImport(filePath, componentName, identifier, this.dynamicImports);
  }

  /**
  * Imports are aggregated and only added once. Name and identifier are optional.
  * Import name from <filepath>
  * returns the identifier specified or the name.
  */
  addReactLazyImport(filePath, name, identifier) {
    this.addImport('react', 'React');
    const componentName = name || `ReactLazyImport${Object.keys(this.reactLazyImports).length + 1}`;
    return ImportAggregator.internalAddImport(filePath, componentName, identifier, this.reactLazyImports);
  }

  /**
  * Returns a string of all the code imports.
  */
  toCodeString() {
    const imports = Object.keys(this.imports).reduce((acc, cur) => (
      `${acc} import ${this.imports[cur]} from '${ImportAggregator.formatString(cur)}';\n`
    ), '');
    const dynamicImports = Object.keys(this.dynamicImports).reduce((acc, cur) => (
      `${acc} const  ${this.dynamicImports[cur]} = () => import('${ImportAggregator.formatString(cur)}');\n`
    ), '');
    const reactLazyImports = Object.keys(this.reactLazyImports).reduce((acc, cur) => (
      `${acc} const  ${this.reactLazyImports[cur]} = React.lazy(() => import('${ImportAggregator.formatString(cur)}'));\n`
    ), '');
    return imports + dynamicImports + reactLazyImports;
  }

  /**
  * This provides a relative path from dev-site-config to the dev-site-config-build folder
  */
  static relativePath(contentPath) {
    if (contentPath[0] === '.') {
      return path.resolve(process.cwd(), 'dev-site-config', contentPath);
    }

    return contentPath;
  }
}

module.exports = ImportAggregator;
