const commander = require('commander');
const generate = require('./generateAppConfig');

const packageJson = require('../../package.json');
const loadDefaultSiteConfig = require('./loadDefaultSiteConfig');


// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config <path>', 'The site config.', undefined)
  .option('-p, --production', 'Passes the -p flag to the webpack config, if available.', false)
  .parse(process.argv);

generate(loadDefaultSiteConfig(commander.config), commander.production);
