const path = require('path');
const fs = require('fs');
const kebabCase = require('lodash.kebabcase');

const writeComponentConfig = (packageConfigs, componentImports, outputPath, addPages, addTests) => {
  // Genenerate Expected Component Configuration
  const componentConfig = {};
  packageConfigs.forEach((pkg) => {
    const pages = addPages && pkg.pages.length > 0 ? { pages: pkg.pages } : {};
    const tests = addTests && pkg.tests.length > 0 ? { tests: pkg.tests } : {};

    const configInfo = {
      name: `'${pkg.name}'`,
      path: `'/${kebabCase(pkg.name)}'`,
      ...pages,
      ...tests,
    };

    // If the package name contains a hyphen, add quotes to pass linter
    const componentKey = pkg.packageName.includes('-') ? `'${pkg.packageName}'` : `${pkg.packageName}`;
    componentConfig[`${componentKey}`] = configInfo;
  });

  // Add documentation to component imports
  const imports = componentImports;

  if (imports.pages) {
    imports.pages = `// Component Examples\n${imports.pages}`;
  }

  if (imports.tests) {
    imports.tests = `// Component Test Examples\n${imports.tests}`;
  }

  // Clean up the generated configuration to pass the linter
  // Replace double quotes with single quotes and add any missing trailing commas
  let configString = JSON.stringify(componentConfig, null, 2).replace(/"/g, '').replace(/}(?!,)/g, '},').replace(/](?!,)/g, '],');
  // Replace the last comma with a semicolon
  configString = configString.replace(/,$/, '');

  // Add the configuration to the configuration template for site consumption
  fs.readFile(path.join(__dirname, 'generatedComponentConfig.template'), 'utf8', (err, data) => {
    let generatedConfig = data.replace('<example_imports>', imports.pages);
    generatedConfig = generatedConfig.replace('<test_imports>', imports.tests);
    generatedConfig = generatedConfig.replace('<config>', `const componentConfig = ${configString};`);

    fs.writeFileSync(path.join(path.resolve(process.cwd(), outputPath), 'generatedComponentConfig.js'), generatedConfig);
  });
};


module.exports = writeComponentConfig;
