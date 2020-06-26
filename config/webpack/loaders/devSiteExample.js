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
  const exampleCssSource = ('/Users/dm068655/Documents/ExternalR/terra-dev-site/src/terra-dev-site/test/loaders/example2.scss');

  let cssFileName;
  // eslint-disable-next-line import/order
  const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(exampleSource),
  });

  lineReader.on('line', (line) => {
    if (line.includes('.scss') === true || line.includes('.css' === true)) {
      cssFileName = line;
      console.log(cssFileName);
    }
  });
  console.log(cssFileName);
  // console.log(path.resolve(exampleSource, cssFileName));

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
