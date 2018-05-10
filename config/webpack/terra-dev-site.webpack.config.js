
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const generateAppConfig = require('../../scripts/generate-app-config/generateAppConfig');
const loadDefaultSiteConfig = require('../../scripts/generate-app-config/loadDefaultSiteConfig');
const fs = require('fs');


const addAlias = (acc, name, location, hotReloading, production) => {
  acc[name] = path.join(location);
  if (!production && hotReloading.enabled) {
    acc[`${name}/${hotReloading.dist}`] = `${name}/${hotReloading.source}`;
  }
};

const aliasMonoRepoPackages = (monoRepoPackageDir, hotReloading, production) => {
  if (!fs.existsSync(monoRepoPackageDir)) {
    return {};
  }
  // console.log(fs.readdirSync(monoRepoPackageDir));
  return fs.readdirSync(monoRepoPackageDir).reduce((acc, packageName) => {
    // ignore any hidden files
    if (packageName[0] !== '.') {
      addAlias(acc, packageName, path.join(monoRepoPackageDir, packageName), hotReloading, production);
    }
    return acc;
  }, {});
};

const aliasCurrentPackage = (packageName, processPath, sourceDir) => {
  const alias = {};
  addAlias(alias, packageName, processPath, sourceDir);
  return alias;
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

  const packageName = siteConfig.npmPackage.name;

  const { hotReloading } = siteConfig;

  // const sourceDir = (production || !hotReloading.enabled) ? hotReloading.dist : hotReloading.source;
  // console.log(aliasMonoRepoPackages(siteConfig.monoRepoPackageDir, sourceDir));
  const alias = {
    ...aliasMonoRepoPackages(siteConfig.monoRepoPackageDir, hotReloading, production),
    ...siteConfig.webpackAliases,
    ...aliasCurrentPackage(packageName, processPath, hotReloading, production),
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
