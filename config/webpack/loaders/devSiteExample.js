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

  const code = [
    'import React from \'react\';',
    `import Example from '${exampleSource}';`,
    `import Code from '${exampleSource}?dev-site-codeblock';`,
    'import ExampleTemplate from \'terra-dev-site/lib/loader-components/_ExampleTemplate\';',
    '',
    `export default ({ title, description, isExpanded }) => (
      <ExampleTemplate
        title={ title || '${startCase(parsedResourcePath.name)}'}
        description={description}
        example={<Example />}
        exampleSrc={<Code />}
        isExpanded={isExpanded}
      />
    );`,
  ].join('\n');

  return callback(null, code);
};

module.exports = loader;
