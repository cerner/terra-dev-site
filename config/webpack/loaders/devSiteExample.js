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
  let exampleCssSource;

  let cssFileName;
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

  if (cssFileName !== undefined) {
    exampleCssSource = path.join(parsedResourcePath.dir, cssFileName);
  } else {
    exampleCssSource = '/Users/dm068655/Documents/ExternalR/terra-dev-site/src/terra-dev-site/test/loaders/example2.scss';
  }

  const code = [
    'import React from \'react\';',
    `import Example from '${exampleSource}';`,
    `import Code from '${exampleSource}?dev-site-codeblock';`,
    `import Css from '${exampleCssSource}?dev-site-codeblock'`,
    'import ExampleTemplate from \'terra-dev-site/lib/loader-components/_ExampleTemplate\';',
    '',
    `export default ({ title, description, isExpanded, isCssExpanded }) => (
      <ExampleTemplate
        title={ title || '${startCase(parsedResourcePath.name)}'}
        description={description}
        example={<Example />}
        exampleSrc={<Code />}
        exampleCssSrc={<Css />}
        isExpanded={isExpanded}
        isCssExpanded={isCssExpanded}
      />
    );`,
  ].join('\n');

  return callback(null, code);
};

module.exports = loader;
