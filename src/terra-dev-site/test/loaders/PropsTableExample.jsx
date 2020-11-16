import React from 'react';
import PropTypes from 'prop-types';

/* eslint-disable react/forbid-prop-types, react/no-unused-prop-types */
const propTypes = {
  /**
   * An array
   */
  optionalArray: PropTypes.array,
  /**
   * A boolean
   */
  optionalBool: PropTypes.bool,
  /**
   * A function
   */
  optionalFunc: PropTypes.func,
  /**
   * A number
   */
  optionalNumber: PropTypes.number,
  /**
   * An object
   */
  optionalObject: PropTypes.object,
  /**
   * A string
   */
  optionalString: PropTypes.string,
  /**
   * A symbol
   */
  optionalSymbol: PropTypes.symbol,
  /**
   * Anything that can be rendered: numbers, strings, elements or an array (or fragment) containing these types.
   */
  optionalNode: PropTypes.node,
  /**
   * A React element.
   */
  optionalElement: PropTypes.element,
  /**
   * A React element type (ie. MyComponent).
   */
  optionalElementType: PropTypes.elementType,
  /**
   * This uses JS's instanceof operator. Instance of should be described here. instanceOf(Message)
   */
  optionalMessage: PropTypes.instanceOf(Message), // eslint-disable-line no-undef
  /**
   * An enum of values. Values should be described here. One of `News` or `Photos`
   */
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),
  /**
   * An object that could be one of many types. Supported types should be described here. Supports string, number, and instanceOf(Message)
   */
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message), // eslint-disable-line no-undef
  ]),
  /**
   * An array of a certain type
   */
  optionalArrayOf: PropTypes.arrayOf(PropTypes.string),
  /**
   * An object with property values of a certain type. objectOf should be described here. objectOf(PropTypes.number)
   */
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),
  /**
   * An object taking on a particular shape
   */
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string.isRequired,
    fontSize: PropTypes.number,
  }),
  /**
   * An object with warnings on extra properties
   */
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number,
  }),
  /**
   * Required prop
   */
  requiredFunc: PropTypes.func.isRequired,
  /**
   * Another required prop
   */
  requiredAny: PropTypes.any.isRequired,
  /**
   * @private
   * This prop is private and should not be display in documentation
   */
  private: PropTypes.string,
  /**
   * An Example of fancypants markdown in the comment
   * ```jsx
   * <div>
   *   <h1>
   *    {intl.formatMessage({ id: 'Terra.devSite.themed.help' })}
   *   </h1>
   * </div>
   * ```
   */
  mdx: PropTypes.string,
};
/* eslint-enable react/forbid-prop-types, react/no-unused-prop-types */

const defaultProps = {
  optionalBool: true,
  optionalArrayOf: ['derp'],
};

const Example = () => (
  <div>
    <h1>
      props table example
    </h1>
  </div>
);

Example.propTypes = propTypes;
Example.defaultProps = defaultProps;

export default Example;
