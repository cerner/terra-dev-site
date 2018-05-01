
const path = require('path');
const toAST = require('to-ast');
const escodegen = require('escodegen');

const writeConfig = ({ config, imports }, fileName, filePath, fs) => {
  // Convert object
  const ast = toAST(config);
  const configString = escodegen.generate(ast,
    {
      format: {
        indent: {
          style: '   ',
        },
      },
    },
  );

  fs.mkdirpSync(filePath);

  let importsString = '';
  if (imports) {
    importsString = imports.toCodeString();
  }

  fs.writeFileSync(path.join(filePath, fileName), `${importsString}\n export default ${configString};\n`);
};

module.exports = writeConfig;
