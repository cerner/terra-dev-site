
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const generateAppConfig = require('../../scripts/generate-app-config/generateAppConfig');
const loadDefaultSiteConfig = require('../../scripts/generate-app-config/loadDefaultSiteConfig');
const fs = require('fs');


const aliasMonoRepoPackages = (monoRepoPackageDir, sourceDir) => {
  if (!fs.existsSync(monoRepoPackageDir)) {
    console.log('dir not found');
    return {};
  }
  const packages = fs.readdirSync(monoRepoPackageDir);
  console.log(fs.readdirSync(monoRepoPackageDir));
  return packages.reduce((acc, packageName) => {
    if (packageName[0] !== '.') {
      acc[packageName] = path.join(monoRepoPackageDir, packageName);
      acc[path.join(packageName, 'lib')] = path.join(monoRepoPackageDir, packageName, sourceDir);
    }
    return acc;
  }, {});
};

const devSiteConfig = (env = {}, argv = {}) => {
  const production = argv.p;
  const processPath = process.cwd();
  /* Get the root path of a mono-repo process call */
  const rootPath = processPath.includes('packages') ? processPath.split('packages')[0] : processPath;

  /* Get the site configuration to add as a resolve path */
  const devSiteConfigPath = path.resolve(path.join(rootPath, 'dev-site-config'));

  const siteConfig = loadDefaultSiteConfig();

  generateAppConfig(siteConfig);

  // const monoRepoPackageDir = siteConfig.monoRepoPackageDir;

  // console.log(monoRepoPackageDir);

  const packageName = siteConfig.npmPackage.name;

  const sourceDir = production ? 'lib' : 'src';
  // console.log(aliasMonoRepoPackages(siteConfig.monoRepoPackageDir, sourceDir));
  const alias = {
    ...aliasMonoRepoPackages(siteConfig.monoRepoPackageDir, sourceDir),
    ...siteConfig.webpackAliases,
    [packageName]: path.join(processPath),
    [path.join(packageName, 'lib')]: path.join(processPath, sourceDir),
  };

  console.log('alias', alias);

  return {
    entry: {
      'terra-dev-site': path.resolve(path.join(__dirname, '..', '..', 'lib', 'Index')),
    },
    plugins: [new HtmlWebpackPlugin({
      title: siteConfig.appConfig.title,
      template: path.join(__dirname, '..', '..', 'lib', 'index.html'),
    })],
    resolve: {
      modules: [devSiteConfigPath],
      alias,
    },
    watch: true,
  };
};

module.exports = devSiteConfig;
