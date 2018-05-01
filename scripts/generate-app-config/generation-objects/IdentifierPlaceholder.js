class IdentifierPlaceholder {
  constructor(variable) {
    this.variable = variable;
  }

  toAST() {
    return {
      type: 'Identifier',
      name: this.variable,
    };
  }
}

module.exports = IdentifierPlaceholder;
