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

const generatePropsTable = async function generatePropsTable(filePath, source, mdxOptions, callback) {
  let parsedProps;
  try {
    parsedProps = reactDocs.parse(source);
  } catch (e) {
    return callback(`Could not convert file to props table:\n${filePath}\n${e}`);
  }

  // loop through parsed props to generate table.
  const rows = await Promise.all(Object.entries(parsedProps.props).map(async ([name, prop]) => {
    if (prop.description.includes('@private')) {
      return '';
    }
    const type = await propType(prop.type, mdxOptions, callback);
    const defaultValue = propDefaultValue(prop.defaultValue);
    const description = await propMdx(prop.description, mdxOptions, callback);
    const required = prop.required || (prop.type.name === 'custom' && prop.type.raw && prop.type.raw.includes('isRequired')) ? 'true' : 'false';

    // create the string for the props table component
    return `{ name: '${name}', type: ${type}, required: ${required}, defaultValue: '${defaultValue}', description: ${description}, },`;
  }));

  return [
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
};

/**
 * The async loader to create the props table component
 * Don't use an arrow function or you wont have access to `this`
 */
const loader = async function loader(content) {
  // Retrieve mdx options and resolve extensions.
  const { resolveExtensions, mdx: mdxOptions } = getOptions(this);
  // Find src
  const { resourcePath } = this;
  const { source, filePath } = findSource(resourcePath, resolveExtensions);

  const callback = this.async();

  // short circuit, if this already is the source file, just return that.
  if (filePath === resourcePath) {
    return callback(null, await generatePropsTable(filePath, content, mdxOptions, callback));
  }
  // ensure src exists
  return this.resolve('', source, async (err, result) => {
    if (err) {
      return callback(new Error(`A non transpiled source file is required for the props table to be generated:\n${source}`));
    }

    // Add the src file to webpack's dependency list
    this.addDependency(result);

    // Read src file
    return this.fs.readFile(result, async (readFileError, srcFile) => (
      callback(null, await generatePropsTable(result, srcFile, mdxOptions, callback))
    ));
  });
};

module.exports = loader;
