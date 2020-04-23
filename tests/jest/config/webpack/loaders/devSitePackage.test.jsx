import 'regenerator-runtime/runtime';

const path = require('path');
const { runLoaders } = require('loader-runner');

describe('devSitePackage loader test', () => {
  it('when both repository url and repository directory are specified', (done) => {
    runLoaders({
      resource: path.resolve(__dirname, './pretendPackageOne.json'),
      loaders: [
        path.resolve(__dirname, '../../../../../config/webpack/loaders/devSitePackage'),
      ],
    }, (err, result) => {
      if (err) return done(err);
      expect(result.result[0]).toMatchSnapshot();
      return done();
    });
  });

  it('when only repository url is specified', (done) => {
    runLoaders({
      resource: path.resolve(__dirname, './pretendPackageTwo.json'),
      loaders: [
        path.resolve(__dirname, '../../../../../config/webpack/loaders/devSitePackage'),
      ],
    }, (err, result) => {
      if (err) return done(err);
      expect(result.result[0]).toMatchSnapshot();
      return done();
    });
  });

  it('when only repository directory is specified', (done) => {
    runLoaders({
      resource: path.resolve(__dirname, './pretendPackageThree.json'),
      loaders: [
        path.resolve(__dirname, '../../../../../config/webpack/loaders/devSitePackage'),
      ],
    }, (err, result) => {
      if (err) return done(err);
      expect(result.result[0]).toMatchSnapshot();
      return done();
    });
  });

  it('when repository attribute is not specified', (done) => {
    runLoaders({
      resource: path.resolve(__dirname, './pretendPackageFour.json'),
      loaders: [
        path.resolve(__dirname, '../../../../../config/webpack/loaders/devSitePackage'),
      ],
    }, (err, result) => {
      if (err) return done(err);
      expect(result.result[0]).toMatchSnapshot();
      return done();
    });
  });

  it('when url is specified without git+ prefix and directory starts with front slash', (done) => {
    runLoaders({
      resource: path.resolve(__dirname, './pretendPackageFive.json'),
      loaders: [
        path.resolve(__dirname, '../../../../../config/webpack/loaders/devSitePackage'),
      ],
    }, (err, result) => {
      if (err) return done(err);
      expect(result.result[0]).toMatchSnapshot();
      return done();
    });
  });

  it('when the repository url is not a git url', (done) => {
    runLoaders({
      resource: path.resolve(__dirname, './pretendPackageSix.json'),
      loaders: [
        path.resolve(__dirname, '../../../../../config/webpack/loaders/devSitePackage'),
      ],
    }, (err, result) => {
      if (err) return done(err);
      expect(result.result[0]).toMatchSnapshot();
      return done();
    });
  });
});
