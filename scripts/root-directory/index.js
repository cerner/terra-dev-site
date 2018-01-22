// const path = require('path');
// const commander = require('commander');
// const glob = require('glob');
// const fs = require('fs');
// const packageJson = require('../../package.json');

// const isFile = filePath =>
//   fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory();
//
// const pathToResolve = 'site.config.js';
//
// const configPath = path.isAbsolute(pathToResolve)
//       ? pathToResolve
//       : path.resolve(cwd, pathToResolve);
//
// if (isFile(absolutePath)) {
//   return absolutePath;
// }
//
// if (!fs.existsSync(absolutePath)) {
//     throw new Error(
//       `Can't find a root directory while resolving a config file path.\n` +
//         `Provided path to resolve: ${pathToResolve}\n` +
//         `cwd: ${cwd}`,
//     );
//   }
// return false;
//
// const siteConfig = require(configPath);
//
// import type {InitialOptions, Path} from 'types/Config';
//
// Read the configuration and set its `rootDir`
export default () => {
//
//
//
//
//   const isJSON = configPath.endsWith('.json');
//   let configObject;
//
//   try {
//     // $FlowFixMe dynamic require
//     configObject = require(configPath);
//   } catch (error) {
//     if (isJSON) {
//       throw new Error(
//         `Jest: Failed to parse config file ${configPath}\n` +
//           `  ${jsonlint.errors(fs.readFileSync(configPath, 'utf8'))}`,
//       );
//     } else {
//       throw error;
//     }
//   }
//
//   if (configPath.endsWith(PACKAGE_JSON)) {
//     // Event if there's no "jest" property in package.json we will still use
//     // an empty object.
//     configObject = configObject.jest || {};
//   }
//
//   if (configObject.rootDir) {
//     // We don't touch it if it has an absolute path specified
//     if (!path.isAbsolute(configObject.rootDir)) {
//       // otherwise, we'll resolve it relative to the file's __dirname
//       configObject.rootDir = path.resolve(
//         path.dirname(configPath),
//         configObject.rootDir,
//       );
//     }
//   } else {
//     // If rootDir is not there, we'll set it to this file's __dirname
//     configObject.rootDir = path.dirname(configPath);
//   }
//
  console.log(process.cwd());
  return { };
};
