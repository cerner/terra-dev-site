const jestConfig = require('@cerner/jest-config-terra');

module.exports = {
  ...jestConfig,
  setupFiles: [
    './jest.enzymeSetup.js',
    './jest.envSetup.js',
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
};

