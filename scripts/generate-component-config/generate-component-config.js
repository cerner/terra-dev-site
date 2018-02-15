const path = require('path');
const commander = require('commander');
const glob = require('glob');
const fs = require('fs');
const packageJson = require('../../package.json');
const buildComponentConfig = require('./build-component-config');
const writeComponentConfig = require('./write-component-config');

// Adds custom search paths
const customSearchPatterns = [];
const addCustomPattern = (searchPattern) => {
  const customPattern = searchPattern.split('/').join(path.sep);
  customSearchPatterns.push(path.resolve(process.cwd(), customPattern));
};

// Parse process arguments
commander
  .version(packageJson.version)
  .option('-s, --search [searchPattern]', 'Regex pattern to search for site and tests examples', addCustomPattern)
  .option('-o, --output [outputPath]', 'The output location of the generated configuration file', './')
  .option('--no-pages', 'Disable the generation of page example configuration')
  .option('--no-tests', 'Disable the generation of test example configuration')
  .option('--check-node-modules', 'Determines if the search patterns should check for terra-repos installed as packages')
  .parse(process.argv);

/** Default Search Paths
 *  Examples in root:
 *     dir/examples/files
 *     dir/examples/test-examples
 *     dir/examples/ * /files
 *     dir/examples/ * /test-examples
 *  Examples within packages:
 *     dir/packages/ * /examples/files
 *     dir/packages/ * /examples/test-examples
 *     dir/packages/ * /examples/ * /files
 *     dir/packages/ * /examples/ * /test-examples
 */
const compiledDirPattern = `{examples,${path.join('examples', '*')}}`;
const terraReposAsPackages = path.join('node_modules', '{terra-core,terra-clinical,terra-framework,terra-consumer}');

// let testsSearchPattern;
let testsSearchPatternJSX;
let testsSearchPatternJS;
if (commander.tests) {
  // testsSearchPattern = path.join('test-examples', '*?(.jsx|.js)');
  testsSearchPatternJSX = path.join('test-examples', '*?(.jsx)');
  testsSearchPatternJS = path.join('test-examples', '*?(.js)');
}

// let pagesSearchPattern;
let pagesSearchPatternJSX;
let pagesSearchPatternJS;
if (commander.pages) {
  // pagesSearchPattern = '*.site-page?(.jsx|.js)';
  pagesSearchPatternJSX = '*.site-page?(.jsx)';
  pagesSearchPatternJS = '*.site-page?(.js)';
}

const examplesPattern = `{${pagesSearchPatternJS}, ${pagesSearchPatternJSX},${testsSearchPatternJS},${testsSearchPatternJSX}}`;

const defaultSearchPatterns = [
  path.resolve(process.cwd(), `${compiledDirPattern}`, `${examplesPattern}`),
  path.resolve(process.cwd(), 'packages', '*', `${compiledDirPattern}`, `${examplesPattern}`),
];

if (commander.checkNodeModules) {
  defaultSearchPatterns.push(path.resolve(process.cwd(), `${terraReposAsPackages}`, `${compiledDirPattern}`, `${examplesPattern}`));
  defaultSearchPatterns.push(path.resolve(process.cwd(), `${terraReposAsPackages}`, 'packages', '*', `${compiledDirPattern}`, `${examplesPattern}`));
}

const searchPaths = defaultSearchPatterns.concat(customSearchPatterns);

let foundFiles = [];
searchPaths.forEach((searchPath) => {
  foundFiles = foundFiles.concat(glob.sync(searchPath, { nodir: true }));
});

const repositoryName = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'))).name;

// Find the output directory depth to create the correct import paths in buildComponentConfig
const outputPath = commander.output;
const outputPathDepth = outputPath === './' ? 0 : outputPath.replace('./', '').split(path.sep).length;

foundFiles.sort();
const { packageConfigs, imports } = buildComponentConfig(foundFiles, repositoryName, outputPathDepth);

writeComponentConfig(packageConfigs, imports, commander.output, commander.pages, commander.tests);
