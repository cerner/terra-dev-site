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
  customSearchPatterns.push(path.resolve(process.cwd(), searchPattern));
};

// Parse process arguments
commander
  .version(packageJson.version)
  .option('-s, --search [searchPattern]', 'Regex pattern to search for site and tests examples', addCustomPattern)
  .option('--no-pages', 'Disable the gerneation of page example configuration')
  .option('--no-tests', 'Disable the generation of test example configuration')
  .parse(process.argv);

/** Default Search Paths
 *  Examples in root:
 *     dir/examples-lib/files
 *     dir/examples-lib/test-examples
 *     dir/examples-lib/ * /files
 *     dir/examples-lib/ * /test-examples
 *  Examples within packages:
 *     dir/packages/ * /examples-lib/files
 *     dir/packages/ * /examples-lib/test-examples
 *     dir/packages/ * /examples-lib/ * /files
 *     dir/packages/ * /examples-lib/ * /test-examples
 */
const compiledDirPattern = `{examples-lib,${path.join('examples-lib', '*')}}`;

let testsSearchPattern;
if (commander.tests) {
  testsSearchPattern = path.join('test-examples', '*?(.jsx|.js)');
}

let pagesSearchPattern;
if (commander.pages) {
  pagesSearchPattern = '*.site-page?(.jsx|.js)';
}

const examplesPattern = `{${pagesSearchPattern},${testsSearchPattern}}`;

const defaultSearchPatterns = [
  path.resolve(process.cwd(), `${compiledDirPattern}`, `${examplesPattern}`),
  path.resolve(process.cwd(), 'packages', '*', `${compiledDirPattern}`, `${examplesPattern}`),
];

const searchPaths = defaultSearchPatterns.concat(customSearchPatterns);

let foundFiles = [];
searchPaths.forEach((searchPath) => {
  foundFiles = foundFiles.concat(glob.sync(searchPath, { nodir: true }));
});

const repositoryName = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'))).name;

const { packageConfigs, imports } = buildComponentConfig(foundFiles, repositoryName);

writeComponentConfig(packageConfigs, imports, commander.pages, commander.tests);
