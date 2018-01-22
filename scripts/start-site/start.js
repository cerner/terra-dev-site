const path = require('path');
const commander = require('commander');
const packageJson = require('../../package.json');

commander
  .version(packageJson.version)
  .option('-c, --config [configFile]', 'the site configuration object')
  .parse(process.argv);
