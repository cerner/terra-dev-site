const IdentifierPlaceholder = require('./IdentifierPlaceholder');

class ImportAggregator {
  constructor() {
    this.imports = {};
  }

  addImport(path, name, identifier) {
    if (!this.imports[path]) {
      const componentName = name || `Component${Object.keys(this.imports).length + 1}`;
      this.imports[path] = componentName;
    }

    const ident = identifier || this.imports[path];

    return new IdentifierPlaceholder(ident);
  }

  toCodeString() {
    return Object.keys(this.imports).reduce((acc, cur) => `${acc} import ${this.imports[cur]} from '${cur}';\n`, '');
  }
}

module.exports = ImportAggregator;
