const path = require('path');
const shell = require('shelljs');
const commander = require('commander');
const packageJson = require('../../package.json');

commander
  .version(packageJson.version)
  .option('-c, --config [configFile]', 'the site configuration')
  .option('-w, --webpack-config [configFile]', 'the webpack configuration')
  .parse(process.argv);

const webpackConfigPath = path.resolve(__dirname, 'site.webpack.config');
shell.exec(`webpack-dev-server --config ${webpackConfigPath} --progress`);
