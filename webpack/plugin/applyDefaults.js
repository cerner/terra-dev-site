const startCase = require('lodash.startcase');
const fs = require('fs');
const path = require('path');

const npmPackage = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));

const applyDefaults = ({
  indexPath = '/home',
  primaryNavigationItems = [{
    path: '/home',
    text: 'Home',
    contentExtension: 'home',
    additionalContent: [
      {
        title: 'Home',
        path: path.resolve(process.cwd(), 'README.md'),
      },
    ],
  }, {
    path: '/components',
    text: 'Components',
    contentExtension: 'doc',
  }, {
    path: '/tests',
    text: 'Tests',
    contentExtension: 'test',
  }],
  additionalSearchDirectories = [],
  sideEffectImportFilePaths = [],
  titleConfig = {
    title: startCase(npmPackage.name),
  },
  defaultLocale,
  defaultTheme,
  defaultDirection,
  faviconFilePath = path.join(__dirname, '..', '..', 'terra-favicon', '32px', 'favicon.ico'),
  extensions = [],
  headHtml = [],
  prefix,
  sites = {},
  sourceFolder = 'src',
  distributionFolder = 'lib',
}) => ({
  indexPath,
  primaryNavigationItems,
  additionalSearchDirectories,
  sideEffectImportFilePaths,
  titleConfig,
  defaultLocale,
  defaultTheme,
  defaultDirection,
  faviconFilePath,
  extensions,
  headHtml,
  prefix,
  sites,
  sourceFolder,
  distributionFolder,
  namespace: npmPackage.name,
});

module.exports = applyDefaults;
