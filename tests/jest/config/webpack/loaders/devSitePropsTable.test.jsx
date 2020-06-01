import 'regenerator-runtime/runtime';

// jest.mock('../../../../../src/terra-dev-site/test/loaders/PropsTableExample.jsx');
// jest.mock('/Users/dm068655/Documents/terra-dev-site/lib/terra-dev-site/test/loaders/PropsTableExample.js');

const path = require('path');
const { runLoaders } = require('loader-runner');

describe('devSitePropsTable test', () => {
  it('when the propsTable lib file does not match the source file', (done) => {
    runLoaders({
      resource: path.resolve(__dirname, '../../../../../src/terra-dev-site/test/loaders/PropsTableExample.jsx'),
      loaders: [
        path.resolve(__dirname, '../../../../../config/webpack/loaders/devSitePropsTable'),
      ],
    }, (err, result) => {
      if (err) return done(err);
      expect(result.result[0]).toMatchSnapshot();
      return done();
    });
  });
});
