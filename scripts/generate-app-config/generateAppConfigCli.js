const commander = require('commander');
const generate = require('./generateAppConfig');

const packageJson = require('../../package.json');
const loadSiteConfig = require('./loadSiteConfig');

// Parse process arguments
commander
  .version(packageJson.version)
  .option('-p, --production', 'Passes the -p flag to the webpack config, if available.', false)
  .option('-v, --verbose', 'Print out debug information.', false)
  .parse(process.argv);

generate({
  siteConfig: loadSiteConfig(),
  mode: commander.production ? 'production' : 'development',
  verbose: commander.verbose,
});
