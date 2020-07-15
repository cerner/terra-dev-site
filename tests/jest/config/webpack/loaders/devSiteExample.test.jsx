import 'regenerator-runtime/runtime';

const path = require('path');
const { runLoaders } = require('loader-runner');

describe('devSiteExample file test', () => {
  it('when a valid css file is present', (done) => {
    runLoaders({
      resource: path.resolve(__dirname, './pretendExample.jsx'),
      loaders: [
        path.resolve(__dirname, '../../../../../config/webpack/loaders/devSiteExample'),
      ],
    }, (err, result) => {
      if (err) return done(err);
      expect(result.result[0]).toMatchSnapshot();
      return done();
    });
  });

  it('when an unresolvable css file is present', (done) => {
    runLoaders({
      resource: path.resolve(__dirname, './pretendExample2.jsx'),
      loaders: [
        path.resolve(__dirname, '../../../../../config/webpack/loaders/devSiteExample'),
      ],
    }, (err, result) => {
      if (err) return done(err);
      expect(result.result[0]).toMatchSnapshot();
      return done();
    });
  });

  it('when no css file is present', (done) => {
    runLoaders({
      resource: path.resolve(__dirname, './pretendExample3.jsx'),
      loaders: [
        path.resolve(__dirname, '../../../../../config/webpack/loaders/devSiteExample'),
      ],
    }, (err, result) => {
      if (err) return done(err);
      expect(result.result[0]).toMatchSnapshot();
      return done();
    });
  });
});

