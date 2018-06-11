const path = require('path');
const toAST = require('to-ast');
const escodegen = require('escodegen');

/**
* Write out an object and imports as a code file.
*/
const writeConfig = ({ config, imports }, fileName, filePath, fs) => {
  // Convert object to AST.
  const ast = toAST(config);
  // Convert AST to code string.
  const configString = escodegen.generate(
    ast,
    {
      format: {
        indent: {
          style: '   ',
        },
      },
    },
  );

  // Ensure the directory is there.
  fs.mkdirpSync(filePath);

  // Get the file import string.
  let importsString = '';
  if (imports) {
    importsString = imports.toCodeString();
  }

  // Write out the file.
  fs.writeFileSync(path.join(filePath, fileName), `${importsString}\n export default ${configString};\n`);
};

module.exports = writeConfig;
