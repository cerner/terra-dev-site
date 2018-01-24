const path = require('path');
const shell = require('shelljs');

const webpackConfigPath = path.resolve(__dirname, '..', '..', 'src', 'config', 'webpack.config');

shell.exec(`webpack-dev-server --config ${webpackConfigPath} --progress`);
