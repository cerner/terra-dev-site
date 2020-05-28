jest.mock('/Users/dm068655/Documents/terra-dev-site/src/terra-dev-site/test/loaders/PropsTableExample2.jsx');
jest.mock('/Users/dm068655/Documents/terra-dev-site/lib/terra-dev-site/test/loaders/PropsTableExample.js');

const source = 'terra-dev-site/lib/terra-dev-site/test/loaders/PropsTableExample?dev-site-props-table';

test('error message', done => {
  // eslint-disable-next-line no-unused-vars
  const loader = async function loader(content) {
    const callback = this.async();
    this.resolve('', source, async (err, result) => {
      if (err) {
        return callback(new Error(`A non transpiled source file is required for the props table to be generated:\n${source}\n${err}`));
      }
      expect().toThow(`A non transpiled source file is required for the props table to be generated:\n${source}\n${err}`);
      done();
      return result;
    });
  };
});
