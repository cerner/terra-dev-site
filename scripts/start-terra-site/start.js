const path = require('path');
const shell = require('shelljs');

const webpackConfigPath = path.resolve(__dirname, 'site.webpack.config');

shell.exec(`webpack-dev-server --config ${webpackConfigPath} --progress`);
