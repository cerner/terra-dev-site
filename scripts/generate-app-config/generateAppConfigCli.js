const commander = require('commander');
const generate = require('./generateAppConfig');

const packageJson = require('../../package.json');
const loadDefaultSiteConfig = require('./loadDefaultSiteConfig');


// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config <path>', 'The site config.', undefined)
  .parse(process.argv);

generate(loadDefaultSiteConfig(commander.config));
