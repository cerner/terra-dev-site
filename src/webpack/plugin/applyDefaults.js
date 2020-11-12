const startCase = require('lodash.startcase');
const fs = require('fs');
const path = require('path');

const npmPackage = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));

const applyDefaults = ({
  primaryNavigationItems = [{
    path: '/home',
    label: 'Home',
    contentExtension: 'home',
    additionalContent: [
      {
        label: 'Home',
        filePath: path.resolve(process.cwd(), 'README.md'),
      },
    ],
  }, {
    path: '/components',
    label: 'Components',
    contentExtension: 'doc',
  }, {
    path: '/tests',
    label: 'Tests',
    contentExtension: 'test',
  }],
  additionalSearchDirectories = [],
  sideEffectImportFilePaths = [],
  titleConfig = {
    title: startCase(npmPackage.name.split('/').pop()),
  },
  defaultLocale,
  defaultTheme,
  defaultDirection,
  faviconFilePath = path.join(__dirname, '..', 'terra-favicon', '32px', 'favicon.ico'),
  extensionItems = [],
  headHtml = [],
  pathPrefix,
  sourceFolder = 'src',
  distributionFolder = 'lib',
  enableDebugLogging = false,
} = {}) => ({
  primaryNavigationItems,
  additionalSearchDirectories,
  sideEffectImportFilePaths,
  titleConfig,
  defaultLocale,
  defaultTheme,
  defaultDirection,
  faviconFilePath,
  extensionItems,
  headHtml,
  pathPrefix,
  sourceFolder,
  distributionFolder,
  enableDebugLogging,
  namespace: npmPackage.name,
});

module.exports = applyDefaults;
