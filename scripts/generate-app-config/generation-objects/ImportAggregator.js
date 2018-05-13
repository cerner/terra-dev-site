const IdentifierPlaceholder = require('./IdentifierPlaceholder');
const path = require('path');

class ImportAggregator {
  constructor() {
    this.imports = {};
  }

  addImport(filePath, name, identifier) {
    if (!this.imports[filePath]) {
      const componentName = name || `Component${Object.keys(this.imports).length + 1}`;
      this.imports[filePath] = componentName;
    }

    const ident = identifier || this.imports[filePath];

    return new IdentifierPlaceholder(ident);
  }

  toCodeString() {
    return Object.keys(this.imports).reduce((acc, cur) => `${acc} import ${this.imports[cur]} from '${cur}';\n`, '');
  }

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
