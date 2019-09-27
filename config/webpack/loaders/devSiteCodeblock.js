const path = require('path');
const findSource = require('../loaderUtils/findSource');

/**
 * Load the contents of the file into the codeblock
 * This loader expects to be chained with the mdx loader.
 */
const loader = async function loader() {
  const callback = this.async();

  const exampleSource = this.resourcePath;
  const { source } = findSource(exampleSource);

  this.resolve('', source, (err, result) => {
    const sourcePath = result || exampleSource;

    if (result) {
      // Add the src file to webpack's dependency list
      this.addDependency(result);
    }

    // remove . from extension;
    const extension = path.extname(sourcePath).slice(1);
    // Read src file
    const srcFile = this.fs.readFileSync(sourcePath);

    const md = [
      `\`\`\`${extension}`,
      srcFile,
      '```',
    ].join('\n');

    return callback(null, md);
  });
};

module.exports = loader;
