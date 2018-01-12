const path = require('path');
const commander = require('commander');
const glob = require('glob');
const fs = require('fs');
const kebabCase = require('lodash.kebabcase');
const startCase = require('lodash.startcase');
const packageJson = require('../../package.json');

const customSearchPaths = [];
const collect = (val) => {
  customSearchPaths.push(path.resolve(process.cwd(), val));
};

commander
  .version(packageJson.version)
  .option('-s, --search [path]', 'Array of patterns to search for site and tests examples', collect)
  // .option('-s, --search [path]', 'Array of patterns to search for site and tests examples')
  .option('--no-pages', 'Disable the gerneation of page example configuration')
  .option('--no-tests', 'Disable the generation of test example configuration')
  .parse(process.argv);

let foundFiles = [];

const repositoryName = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'))).name;

// Compiled directory search pattern
const compilePath = 'examples-lib';
// const compiledDirPattern = `${compilePath}`;
const compiledDirPattern = `{${compilePath},${path.join(compilePath, '*')}}`;

// Example files search pattern
const testsSearchPath = commander.tests ? path.join('test-examples', '*?(.jsx|.js)') : null;
const pagesSearchPage = commander.pages ? '*.site-page?(.jsx|.js)' : null;
const examplesPattern = `{${pagesSearchPage},${testsSearchPath}}`;

// Default Search Patterns
//   Examples in root:
//     dir/examples-lib/files
//     dir/examples-lib/test-examples
//     dir/examples-lib/*/files
//     dir/examples-lib/*/test-examples
//   Examples within packages:
//     dir/packages/*/examples-lib/files
//     dir/packages/*/examples-lib/test-examples
//     dir/packages/*/examples-lib/*/files
//     dir/packages/*/examples-lib/*/test-examples
const searchPaths = [
  path.resolve(process.cwd(), `${compiledDirPattern}`, `${examplesPattern}`),
  path.resolve(process.cwd(), 'packages', '*', `${compiledDirPattern}`, `${examplesPattern}`),
];

if (commander.search) {
  customSearchPaths.map(customPath => searchPaths.push(customPath));
}
console.log(searchPaths);


searchPaths.forEach((searchPath) => {
  foundFiles = foundFiles.concat(glob.sync(searchPath, { nodir: true }));
});

// console.log(foundFiles);
const componentImports = {};
const packageConfig = [];
let exampleImports = '';
let testImports = '';

let currPkgConfig = {
  name: undefined,
  packageName: undefined,
  pages: [],
  tests: [],
};

// console.log(foundFiles);

foundFiles.forEach((filePath) => {
  const parsedPath = path.parse(filePath);
  const directory = parsedPath.dir;

  const isPackagePath = directory.includes('packages');
  const isExampleFile = parsedPath.name.includes('.site-page') || parsedPath.dir.includes('example');

  console.log(isPackagePath);

  const fileName = parsedPath.name.replace('.site-page', '');

  let packageName = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'))).name;
  if (isPackagePath) {
    // The package name is the first directory name after packages.
    // Note: spliting on seperator results in the first array element to be "".
    packageName = directory.split('packages')[1].split(path.sep)[1];
  }

  console.log(packageName);

  const packageDirectories = directory.split(packageName)[1].split(path.sep);

  // Assuming lib-examples/example-file or lib-examples/tests-dir/example-file
  // for terra-core/.../
  const spliceAt = isExampleFile ? 3 : 3;
  // const spliceAt = isExampleFile ? 2 : 3;
  const nestedDirectories = packageDirectories.splice(spliceAt, packageDirectories.length);
  const nestedConfig = [];
  nestedDirectories.forEach((dir) => {
    nestedConfig.push({
      name: `'${startCase(dir)}'`,
      path: `'/${kebabCase(dir)}'`,
      // pages: [],
      // tests: [],
    });
  });

  const componentName = startCase(packageName.replace('terra-', ''));

  let importName = `${startCase(fileName)}`.replace(/\s/g, '');
  if (isExampleFile) {
    importName = `${startCase(packageName)}${fileName}`.replace(/\s/g, '');
  }

  // Maintain import name occurances to ensure unique component import names
  if (componentImports[`${importName}`] !== undefined) {
    componentImports[`${importName}`] += 1;
    importName += componentImports[`${importName}`];
  } else {
    componentImports[`${importName}`] = 0;
  }

  const importPath = path.join('..', `${parsedPath.dir.split(repositoryName)[1]}`, `${parsedPath.name}`);
  if (isExampleFile) {
    exampleImports += `import ${importName} from '${importPath}';\n`;
  } else {
    testImports += `import ${importName} from '${importPath}';\n`;
  }

  const fileConfig = {
    name: `'${startCase(fileName)}'`,
    path: `'/${kebabCase(fileName)}'`,
    component: `${importName},`,
  };

  let exampleConfig;
  if (nestedConfig.length) {
    const lastNestedConfig = nestedConfig[nestedConfig.length - 1];
    if (isExampleFile) {
      lastNestedConfig.pages = [fileConfig];
    } else {
      lastNestedConfig.tests = [fileConfig];
    }
    // lastNestedConfig.pages = fileConfig;
    nestedConfig[nestedConfig.length - 1] = lastNestedConfig;

    exampleConfig = nestedConfig[0];
    nestedConfig.shift();
    let count = 1;
    nestedConfig.forEach((dirConfig) => {
      let dirConfigObj = [dirConfig];
      if (count !== nestedConfig.length) {
        dirConfigObj = dirConfig;
      }
      if (isExampleFile) {
        exampleConfig.pages = dirConfigObj;
      } else {
        exampleConfig.tests = dirConfigObj;
      }
      count += 1;
    });
  } else {
    exampleConfig = fileConfig;
  }

  if (packageName === currPkgConfig.packageName) {
    if (isExampleFile) {
      currPkgConfig.pages.push(exampleConfig);
    } else {
      currPkgConfig.tests.push(exampleConfig);
    }
  } else {
    if (isExampleFile) {
      currPkgConfig = { name: componentName, packageName, pages: [exampleConfig], tests: [] };
    } else {
      currPkgConfig = { name: componentName, packageName, pages: [], tests: [exampleConfig] };
    }
    packageConfig.push(currPkgConfig);
  }
});

const componentConfig = {};
packageConfig.forEach((pkg) => {
  const pages = commander.pages && pkg.pages.length > 0 ? { pages: pkg.pages } : {};
  const tests = commander.tests && pkg.tests.length > 0 ? { tests: pkg.tests } : {};

  const configInfo = {
    name: `'${pkg.name}'`,
    path: `'/${kebabCase(pkg.name)}'`,
    ...pages,
    ...tests,
  };
  componentConfig[`'${pkg.packageName}'`] = configInfo;
});

if (exampleImports) {
  exampleImports = `// Component Examples\n${exampleImports}`;
}

if (testImports) {
  testImports = `// Component Test Examples\n${testImports}`;
}

// // Generate configuration file for site consumption
fs.readFile(path.join(__dirname, 'index.template'), 'utf8', (err, data) => {
  let newFileContent = data.replace('<example_imports>', exampleImports);
  newFileContent = newFileContent.replace('<test_imports>', testImports);

  // Replace double quotes with single quotes and add any missing trailing commas
  const configString = JSON.stringify(componentConfig, null, 2).replace(/"/g, '').replace(/}(?!,)/g, '},').replace(/](?!,)/g, '],');

  newFileContent = newFileContent.replace('<config>',
    `const componentConfig = ${configString.replace(/,$/, '')};`,
  );

  fs.writeFileSync(path.join(process.cwd(), 'site', 'generatedComponentConfig.js'), newFileContent);
});
