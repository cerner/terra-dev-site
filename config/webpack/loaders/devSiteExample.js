const path = require('path');
const startCase = require('lodash.startcase');

/**
 * Generate the example with the supplied file.
 * Don't use an arrow function
 */
const loader = async function loader(content) {
  const callback = this.async();

  const exampleSource = this.resourcePath;
  const parsedResourcePath = path.parse(exampleSource);
  let cssFileName;

  if (content.includes('.scss') || content.includes('.css')) {
    cssFileName = content.slice(
      (content.slice(0, content.lastIndexOf('css') + 3)).lastIndexOf('/'),
      content.indexOf('css') + 3,
    );
  }

  const code = [
    'import React from \'react\';',
    `import Example from '${exampleSource}';`,
    `import Code from '${exampleSource}?dev-site-codeblock';`,
    'import ExampleTemplate from \'terra-dev-site/lib/loader-components/_ExampleTemplate\';',
  ];

  if (cssFileName !== undefined) {
    const exampleCssSource = path.join(parsedResourcePath.dir, cssFileName);
    code.push(`import Css from '${exampleCssSource}?dev-site-codeblock';`,
      `export default ({ title, description, isExpanded }) => (
      <ExampleTemplate
        title={ title || '${startCase(parsedResourcePath.name)}'}
        description={description}
        example={<Example />}
        exampleCssSrc={<Css />}
        exampleSrc={<Code />}
        isExpanded={isExpanded}
      />
    );`);
  } else {
    code.push(`export default ({ title, description, isExpanded }) => (
      <ExampleTemplate
        title={ title || '${startCase(parsedResourcePath.name)}'}
        description={description}
        example={<Example />}
        exampleSrc={<Code />}
        isExpanded={isExpanded}
      />
    );`);
  }

  return callback(null, code.join('\n'));
};

module.exports = loader;
