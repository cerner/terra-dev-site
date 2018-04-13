const commander = require('commander');
const path = require('path');
const serve = require('terra-toolkit/scripts/serve/serve-static');

const packageJson = require('../../package.json');


// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config <path>', 'The webpack config to serve. Alias for <config>.')
  .option('--port <n>', 'The port the app should listen on', parseInt)
  .option('-p, --production', 'Pass the -p flag to the webpack config')
  .option('--site <path>', 'The relative path to the static site. This takes precidence over webpack config if both are passed.')
  .option('--vfs', 'The webpack assets will be written to a virtual file system instead of disk.')
  .parse(process.argv);

let config;

if (commander.config) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  config = require(path.resolve(commander.config));
}

serve({
  config,
  site: commander.site,
  vfs: commander.virtualFileSystem,
  port: commander.port,
  production: commander.production,
  name: 'Terra-Dev-Site:serve-static',
});
