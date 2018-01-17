const path = require('path');
const fs = require('fs');
const kebabCase = require('lodash.kebabcase');
const startCase = require('lodash.startcase');

const componentImportNames = {};
const packageConfigs = [];
let currPkgConfig = {};
const imports = {
  pages: '',
  tests: '',
};

/** Recursively compares the existing package configuration to the new file's
  * configuration to add the new configuration at the approprite nested level.
  */
const addToPackageConfig = (packageConfig, newFileConfig, fileType) => {
  let configMatch = false;
  // console.log('\n', '\n', newFileConfig)
  packageConfig[`${fileType}`].forEach((config) => {
    if (config.name === newFileConfig.name) {
      configMatch = true;
      addToPackageConfig(config, newFileConfig[`${fileType}`][0], fileType);
    }
  });

  if (!configMatch) {
    packageConfig[`${fileType}`].push(newFileConfig);
  }
};

/** Determines the import name depending on the file type and then ensures the
  * import name is unqiue.
  */
const getImportName = (packageName, fileName, fileType) => {
  let importName = `${startCase(packageName)}${fileName}`.replace(/\s/g, '');
  if (fileType === 'tests') {
    importName = `${startCase(fileName)}`.replace(/\s/g, '');
  }

  // Track import name occurances to ensure unique component import names
  if (componentImportNames[`${importName}`] !== undefined) {
    componentImportNames[`${importName}`] += 1;
    importName += componentImportNames[`${importName}`];
  } else {
    componentImportNames[`${importName}`] = 0;
  }

  return importName;
};

/** Builds the nested directory configuration for a found file.
  */
const buildNestedComponentConfig = (nestedDirectories, fileConfig, fileType) => {
  // Create the configuration for each directory
  const nestedConfig = [];
  nestedDirectories.forEach((dir) => {
    nestedConfig.push({
      name: `'${startCase(dir)}'`,
      path: `'/${kebabCase(dir)}'`,
    });
  });

  let exampleConfig = fileConfig;

  // Reverse the order to build out the nested configuration from n to 0 directories deep
  nestedConfig.reverse();

  // Build the nested configuration
  nestedConfig.forEach((config) => {
    const currentConfig = config;
    currentConfig[`${fileType}`] = [exampleConfig];
    exampleConfig = config;
  });

  return exampleConfig;
};

/** Builds the configuration for each found file and adds it to the approprite packages
  * configuration.
  */
const buildComponentConfig = (foundFiles, repositoryName) => {
  foundFiles.forEach((filePath) => {
    const parsedPath = path.parse(filePath);
    const directory = parsedPath.dir;
    const fileName = parsedPath.name.replace('.site-page', '');
    const fileType = directory.includes('test') ? 'tests' : 'pages';

    // Get the example's package name
    let packageName = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'))).name;
    if (directory.includes('packages')) {
      // The package name is the first directory name after packages.
      // Note: spliting on seperator results in the first array element to be ''
      packageName = directory.split('packages')[1].split(path.sep)[1];
    }

    // Get the example's import name
    const importName = getImportName(packageName, fileName, fileType);

    // Create the example's import path
    const pathSliceAt = directory.indexOf(repositoryName) + repositoryName.length;
    const directoryPath = directory.slice(pathSliceAt, directory.length);
    const importPath = path.join('..', `${directoryPath}`, `${parsedPath.name}`);

    // Add the example's import statment
    imports[`${fileType}`] += `import ${importName} from '${importPath}';\n`;

    // Create the example's file confirguration
    const fileConfig = {
      name: `'${startCase(fileName)}'`,
      path: `'/${kebabCase(fileName)}'`,
      component: `${importName},`,
    };

    // Determine if the example needs nested configuration built
    const packageDirectories = directory.split(packageName)[1].split(path.sep);
    const sliceAt = fileType === 'tests' || packageName.includes('-site') ? 3 : 2;
    const nestedDirectories = packageDirectories.splice(sliceAt, packageDirectories.length);

    // Create the example's full configuration
    let exampleConfig = fileConfig;
    if (nestedDirectories.length) {
      exampleConfig = buildNestedComponentConfig(nestedDirectories, exampleConfig, fileType);
    }

    // Add the package configuration
    if (packageName === currPkgConfig.packageName) {
      // Add the examples's configuration to existing package configuration
      addToPackageConfig(currPkgConfig, exampleConfig, fileType);
    } else {
      // Create a new package configuration for the example
      const componentName = startCase(packageName.replace('terra-', ''));
      if (fileType === 'tests') {
        currPkgConfig = { name: componentName, packageName, pages: [], tests: [exampleConfig] };
      } else {
        currPkgConfig = { name: componentName, packageName, pages: [exampleConfig], tests: [] };
      }
      packageConfigs.push(currPkgConfig);
    }
  });

  return { packageConfigs, imports };
};

module.exports = buildComponentConfig;
