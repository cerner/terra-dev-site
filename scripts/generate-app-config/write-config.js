
const path = require('path');
const toAST = require('to-ast');
const escodegen = require('escodegen');

const writeConfig = (config, fileName, filePath, fs) => {
  const ast = toAST(config);
  const configString = escodegen.generate(ast);

  fs.mkdirp(filePath);

  fs.writeFileSync(path.join(filePath, fileName), `module.exports = ${configString};\n`);
};

module.exports = writeConfig;

// // const babylon = require('babylon');
// const serialize = require('babel-literal-to-ast');
// const generate = require('babel-generator');
// const babel = require('babel-core');
// const babylon = require('babylon');
// const fs = require('fs');
// const path = require('path');

// const toAST = require('to-ast');
// const escodegen = require('escodegen');

// const code = 'const thing = { message: \'Hello\' }; export default thing;';
// let ast = babylon.parse(code, { sourceType: 'module' });

// console.log('ast', JSON.stringify(ast, null, 4));

// const output = generate.default(ast, { /* options */ }, code);

// console.log('output', output);

// // Get the AST.
// // ast = serialize({ message: 'Hello' });
// ast = toAST({ message: 'Hello' });

// console.log('ast', JSON.stringify(ast, null, 4));

// // const thing = generate.default(ast, { /* options */ });
// // const thing = babel.transformFromAst(ast, code);
// const thing = escodegen.generate(ast);

// console.log('generate', thing);

// const rootPath = path.join(process.cwd(), 'scripts', 'generate-config');

// const template = fs.readFileSync(path.join(rootPath, 'template.txt'), 'utf8');

// console.log('template', template);

// const newFile = template.replace(/<placeholder>/, thing);

// console.log(newFile);

// fs.writeFileSync(path.join(rootPath, 'code.js'), newFile);
