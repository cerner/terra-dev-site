/**
* This class provides an 'identifier' placeholder for code generation.
* This assumes the identifier is imported or required prior.
*/
class IdentifierPlaceholder {
  constructor(variable) {
    this.variable = variable;
  }

  /**
  * Returns the ast representation of the identifier.
  */
  toAST() {
    return {
      type: 'Identifier',
      name: this.variable,
    };
  }
}

module.exports = IdentifierPlaceholder;
