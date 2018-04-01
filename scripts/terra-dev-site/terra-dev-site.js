const commander = require('commander');
const fs = require('fs');
const path = require('path');
const serve = require('webpack-serve');

const packageJson = require('../../package.json');


// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config <path>', 'The webpack config to serve. Alias for <config>.')
  .parse(process.argv);

const isFile = filePath => (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory());


let config;

if (commander.config) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  require(path.resolve(commander.config));
}

console.log('config1', config);

if (!config) {
  const localPath = path.resolve(process.cwd(), 'webpack.config.js');
  if (isFile(localPath)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    config = require(localPath);
  }
}

console.log('config2', config);

if (!config) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  config = require('terra-dev-site/src/config/webpack.config');
}

console.log('config3', config);


serve({ config });
