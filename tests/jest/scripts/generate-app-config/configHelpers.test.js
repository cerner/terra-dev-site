const configHelpers = require('../../../../scripts/generate-app-config/configHelpers');

describe('getNamespace', () => {
  it('returns the namespace when the directory does not include packages or node_modules', () => {
    const directory = '/directory/';
    const namespace = 'namespace';
    const result = configHelpers.getNamespace(directory, namespace);
    expect(result).toEqual(namespace);
  });

  it('returns the package name immediately following the node_module directory', () => {
    const directory = '/node_modules/directory/';
    const namespace = 'namespace';
    const result = configHelpers.getNamespace(directory, namespace);
    expect(result).toEqual('directory');
  });

  it('returns the scoped package name immediately following the node_module directory', () => {
    const directory = '/node_modules/@cerner/directory/';
    const namespace = 'namespace';
    const result = configHelpers.getNamespace(directory, namespace);
    expect(result).toEqual('@cerner/directory');
  });
});
