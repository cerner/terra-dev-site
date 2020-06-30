/* eslint-disable global-require */
const path = require('path');
const startCase = require('lodash.startcase');

/**
 * Generate the example with the supplied file.
 * Don't use an arrow function
 */
const loader = async function loader() {
  const callback = this.async();

  const exampleSource = this.resourcePath;
  const parsedResourcePath = path.parse(exampleSource);

  let code;
  let cssFileName;
  let exampleCssSource;

  /**
   * Use a try catch block in order to synchronously capture the file name for any attached css files
   */
  try {
  // eslint-disable-next-line import/order
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(exampleSource),
      crlfDelay: Infinity,
    });

    lineReader.on('line', (line) => {
      if (line.includes('.scss') === true || line.includes('.css' === true)) {
        cssFileName = (line.slice(line.lastIndexOf('/'), (line.lastIndexOf('css') + 3)));
      }
    });

    await require('events').once(lineReader, 'close');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  // The following code is a wip, it can probably be refactored for efficiency
  if (cssFileName !== undefined) {
    exampleCssSource = path.join(parsedResourcePath.dir, cssFileName);
  }

  code = [
    'import React from \'react\';',
    `import Example from '${exampleSource}';`,
    `import Css from '${exampleCssSource}?dev-site-codeblock';`,
    `import Code from '${exampleSource}?dev-site-codeblock';`,
    'import ExampleTemplate from \'terra-dev-site/lib/loader-components/_ExampleTemplate\';',
    '',
    `export default ({ title, description, isCssExpanded, isExpanded }) => (
      <ExampleTemplate
        title={ title || '${startCase(parsedResourcePath.name)}'}
        description={description}
        example={<Example />}
        exampleCssSrc={<Css />}
        exampleSrc={<Code />}
        isCssExpanded={isCssExpanded}
        isExpanded={isExpanded}
      />
    );`,
  ].join('\n');

  if (exampleCssSource === undefined) {
    code = code.replace('import Css from \'undefined?dev-site-codeblock\';', '');
    code = code.replace('exampleCssSrc={<Css />}', '');
  }

  return callback(null, code);
};

module.exports = loader;
