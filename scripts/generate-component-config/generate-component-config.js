const path = require('path');
const commander = require('commander');
const glob = require('glob');
const fs = require('fs');
const kebabCase = require('lodash.kebabcase');
const startCase = require('lodash.startcase');
const packageJson = require('../../package.json');

let searchPaths = [];
// Adds custom search paths
const addSearchPath = (searchPattern) => {
  searchPaths.push(path.resolve(process.cwd(), searchPattern));
};

// Parse process arguments
commander
  .version(packageJson.version)
  .option('-s, --search [searchPattern]', 'Regex pattern to search for site and tests examples', addSearchPath)
  .option('--no-pages', 'Disable the gerneation of page example configuration')
  .option('--no-tests', 'Disable the generation of test example configuration')
  .parse(process.argv);

/** Default Search Patterns
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

// Example files search patterns
const testsSearchPath = commander.tests ? path.join('test-examples', '*?(.jsx|.js)') : null;
const pagesSearchPage = commander.pages ? '*.site-page?(.jsx|.js)' : null;
const examplesPattern = `{${pagesSearchPage},${testsSearchPath}}`;

searchPaths = searchPaths.concat([
  path.resolve(process.cwd(), `${compiledDirPattern}`, `${examplesPattern}`),
  path.resolve(process.cwd(), 'packages', '*', `${compiledDirPattern}`, `${examplesPattern}`),
]);

let foundFiles = [];
searchPaths.forEach((searchPath) => {
  foundFiles = foundFiles.concat(glob.sync(searchPath, { nodir: true }));
});

const repositoryName = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'))).name;
const componentImports = {};
const packageConfig = [];
const imports = {
  pages: '',
  tests: '',
};

let currPkgConfig = {
  name: undefined,
  packageName: undefined,
  pages: [],
  tests: [],
};

foundFiles.forEach((filePath) => {
  const parsedPath = path.parse(filePath);
  const directory = parsedPath.dir;
  const fileName = parsedPath.name.replace('.site-page', '');
  const fileType = directory.includes('test') ? 'tests' : 'pages';

  // Get the package name
  let packageName = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'))).name;
  if (directory.includes('packages')) {
    // The package name is the first directory name after packages.
    // Note: spliting on seperator results in the first array element to be ''
    packageName = directory.split('packages')[1].split(path.sep)[1];
  }

  // Parse the package directories
  const packageDirectories = directory.split(packageName)[1].split(path.sep);
  const spliceAt = fileType === 'tests' || packageName.includes('-site') ? 3 : 2;
  const nestedDirectories = packageDirectories.splice(spliceAt, packageDirectories.length);

  const nestedConfig = [];
  nestedDirectories.forEach((dir) => {
    const nestedDirConfig = {
      name: `'${startCase(dir)}'`,
      path: `'/${kebabCase(dir)}'`,
    };

    let nestedDirPrevFound = false;
    nestedConfig.forEach((config) => {
      nestedDirPrevFound = JSON.stringify(config) === JSON.stringify(nestedDirConfig);
    });

    if (!nestedDirPrevFound) {
      nestedConfig.push(nestedDirConfig);
    }
  });

  let importName = `${startCase(packageName)}${fileName}`.replace(/\s/g, '');
  if (fileType === 'tests') {
    importName = `${startCase(fileName)}`.replace(/\s/g, '');
  }

  // Maintain import name occurances to ensure unique component import names
  if (componentImports[`${importName}`] !== undefined) {
    componentImports[`${importName}`] += 1;
    importName += componentImports[`${importName}`];
  } else {
    componentImports[`${importName}`] = 0;
  }

  const importPath = path.join('..', `${directory.split(repositoryName)[1]}`, `${parsedPath.name}`);
  imports[`${fileType}`] += `import ${importName} from '${importPath}';\n`;

  const fileConfig = {
    name: `'${startCase(fileName)}'`,
    path: `'/${kebabCase(fileName)}'`,
    component: `${importName},`,
  };

  let exampleConfig = fileConfig;
  if (nestedConfig.length) {
    const lastNestedConfig = nestedConfig[nestedConfig.length - 1];
    lastNestedConfig[`${fileType}`] = [fileConfig];

    nestedConfig[nestedConfig.length - 1] = lastNestedConfig;

    exampleConfig = nestedConfig[0];
    nestedConfig.shift();
    let count = 1;
    nestedConfig.forEach((dirConfig) => {
      let dirConfigObj = [dirConfig];
      if (count !== nestedConfig.length) {
        dirConfigObj = dirConfig;
      }
      exampleConfig[`${fileType}`] = dirConfigObj;

      count += 1;
    });
  }
  if (packageName === currPkgConfig.packageName) {
    currPkgConfig[`${fileType}`].push(exampleConfig);
  } else {
    const componentName = startCase(packageName.replace('terra-', ''));
    if (fileType === 'tests') {
      currPkgConfig = { name: componentName, packageName, pages: [], tests: [exampleConfig] };
    } else {
      currPkgConfig = { name: componentName, packageName, pages: [exampleConfig], tests: [] };
    }

    packageConfig.push(currPkgConfig);
  }
});

const componentConfig = {};
packageConfig.forEach((pkg) => {
  const pages = commander.pages && pkg.pages.length > 0 ? { pages: pkg.pages } : {};
  const tests = commander.tests && pkg.tests.length > 0 ? { tests: pkg.tests } : {};

  const configInfo = {
    name: pkg.name.includes('-') ? `'${pkg.name}'` : `${pkg.name}`,
    path: `'/${kebabCase(pkg.name)}'`,
    ...pages,
    ...tests,
  };
  componentConfig[`'${pkg.packageName}'`] = configInfo;
});

if (imports.pages) {
  imports.pages = `// Component Examples\n${imports.pages}`;
}

if (imports.tests) {
  imports.tests = `// Component Test Examples\n${imports.tests}`;
}

// Generate configuration file for site consumption
fs.readFile(path.join(__dirname, 'index.template'), 'utf8', (err, data) => {
  let generatedConfig = data.replace('<example_imports>', imports.pages);
  generatedConfig = generatedConfig.replace('<test_imports>', imports.tests);

  // Replace double quotes with single quotes and add any missing trailing commas
  const configString = JSON.stringify(componentConfig, null, 2).replace(/"/g, '').replace(/}(?!,)/g, '},').replace(/](?!,)/g, '],');

  // Replace the last comma with a semicolon and add to config
  generatedConfig = generatedConfig.replace('<config>',
    `const componentConfig = ${configString.replace(/,$/, '')};`,
  );

  fs.writeFileSync(path.join(process.cwd(), 'site', 'generatedComponentConfig.js'), generatedConfig);
});
