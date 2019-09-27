const { getOptions } = require('loader-utils');
const mdx = require('@mdx-js/mdx');
const reactDocs = require('react-docgen');
const findSource = require('../loaderUtils/findSource');

/**
 * Create an inline mdx react component.
 * @param {*} description
 * @param {*} callback
 */
const propMdx = async function propMdx(description, options, callback) {
  const mdxOptions = {
    ...options,
    filepath: this.resourcePath,
    skipExport: true,
  };

  try {
    const code = [
      '() => {',
      await mdx(description, mdxOptions),
      // execute the mdx function returned.
      'return MDXContent({});',
      '}',
    ].join('\n');
    return code;
  } catch (err) {
    return callback(err);
  }
};

/**
 * Create the type mdx react component
 * @param {name, value} type
 */
const propType = (type, options, callback) => {
  const { name } = type;
  let { value } = type;

  if (type.name === 'enum') {
    // strip single quotes.
    value = Object.values(value).map((obj) => obj.value.replace(/'/g, ''));
  }

  const val = [
    name,
    ...value
      ? [
        '```json',
        JSON.stringify(value, null, 1),
        '```',
      ]
      : [],
  ].join('\n');

  return propMdx(val, options, callback);
};

/**
 * Create the default value string.
 * @param {*} value
 */
const propDefaultValue = (value) => {
  if (!value) {
    return 'none';
  }
  // re-escape the string
  return value.value.replace(/'/g, '\\\'');
};

/**
 * The async loader to create the props table component
 * Don't use an arrow function or you wont have access to `this`
 */
const loader = async function loader() {
  // Find src
  const { source } = findSource(this.resourcePath);

  const callback = this.async();
  // ensure src exists
  this.resolve('', source, async (err, result) => {
    if (err) {
      return callback(err);
    }

    // Add the src file to webpack's dependency list
    this.addDependency(result);

    // Read src file
    const srcFile = this.fs.readFileSync(result);

    let parsedProps;
    try {
      parsedProps = reactDocs.parse(srcFile);
    } catch (e) {
      return callback(`Could not convert file to props table:\n${result}\n${e}`);
    }

    // Retrieve mdx options
    const mdxOptions = getOptions(this).mdx;

    // loop through parsed props to generate table.
    const rows = await Promise.all(Object.entries(parsedProps.props).map(async ([name, prop]) => {
      if (prop.description.includes('@private')) {
        return '';
      }
      const type = await propType(prop.type, mdxOptions, callback);
      const defaultValue = propDefaultValue(prop.defaultValue);
      const description = await propMdx(prop.description, mdxOptions, callback);
      const required = prop.required ? 'true' : 'false';

      // create the string for the props table component
      return `{ name: '${name}', type: ${type}, required: ${required}, defaultValue: '${defaultValue}', description: ${description}, },`;
    }));

    const code = [
      'import React from \'react\';',
      'import { mdx } from \'@mdx-js/react\';',
      'import PropsTable from \'terra-dev-site/lib/loader-components/_PropsTable\';',
      '',
      'export default () => (',
      ' <PropsTable',
      '   rows={[',
      ...rows,
      '   ]}',
      ' />',
      ');',
    ].join('\n');

    return callback(null, code);
  });
};

module.exports = loader;
