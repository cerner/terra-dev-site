const path = require('path');
const startCase = require('lodash.startcase');
const findCss = require('./devSiteCssFinder');

/**
 * Generate the example with the supplied file.
 * Don't use an arrow function
 */
const loader = async function loader(content) {
  const callback = this.async();

  const exampleSource = this.resourcePath;
  const parsedResourcePath = path.parse(exampleSource);
  const cssFileName = findCss(content);

  const code = [
    'import React from \'react\';',
    `import Example from '${exampleSource}';`,
    `import Code from '${exampleSource}?dev-site-codeblock';`,
    'import ExampleTemplate from \'terra-dev-site/lib/loader-components/_ExampleTemplate\';',
  ];

  if (cssFileName !== undefined) {
    try {
      this.resolve('', cssFileName, async () => {
      });
      code.push(`import Css from '${cssFileName}?dev-site-codeblock';`,
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
    } catch (err) {
      code.push(`export default ({ title, description, isExpanded }) => (
        <ExampleTemplate
          title={ title || '${startCase(parsedResourcePath.name)}'}
          description={description}
          example={<Example />}
          exampleSrc={<Code />}
          isExpanded={isExpanded}
        />
      );`);
      console.error(((`Cannot resolve path:\n${cssFileName}`)));
      console.log(err);
    }
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
