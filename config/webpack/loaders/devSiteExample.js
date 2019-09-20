// const { getOptions } = require('loader-utils');
const path = require('path');
const startCase = require('lodash.startcase');

// Don't use an arrow function
const loader = async function loader() {
  const callback = this.async();

  const exampleSource = this.resourcePath;
  const parsedResourcePath = path.parse(this.resourcePath);
  const originalSource = path.join(parsedResourcePath.dir.replace(/\/lib\//, '/src/'), parsedResourcePath.name);

  this.resolve('', originalSource, (err, result) => {
    const sourcePath = result || exampleSource;
    const code = [
      'import React from \'react\';',
      `import Example from '${exampleSource}';`,
      `import Code from '${sourcePath}?dev-site-codeblock';`,
      'import ExampleTemplate from \'terra-dev-site/lib/loader-components/_ExampleTemplate\'',
      '',
      `export default () => (<ExampleTemplate title="${startCase(parsedResourcePath.name)}" example={<Example />} exampleSrc={<Code />} />);`,
    ];

    return callback(null, code.join('\n'));
  });
};

module.exports = loader;
