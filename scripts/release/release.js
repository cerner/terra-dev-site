#! /usr/bin/env node
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const pacote = require('pacote');
const { execSync } = require('child_process');
const { exit } = require('process');
const packageJson = require('../../package.json');

// If on travis setup git to be able to push the tags
const setupGit = () => {
  const travis = process.env.TRAVIS;

  if (travis) {
    execSync('git config --global user.email "travis@travis-ci.org"');
    execSync('git config --global user.name "Travis CI"');
    const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
    const token = process.env.GITHUB_TOKEN;
    const newUrl = remoteUrl.replace('https://', `https://${token}@`);
    execSync(`git remote set-url origin "${newUrl}" > /dev/null 2>&1`);
  }
};

const isPublished = async () => (
  new Promise((resolve, reject) => (
    pacote.packument(packageJson.name, {
      registry: 'https://registry.npmjs.org/',
    }).then(pkgJson => {
      const publishedVersions = Object.keys(pkgJson.versions);
      resolve(publishedVersions.includes(packageJson.version));
    }).catch((err) => reject(err))
  ))
);

const release = async () => {
  if (await isPublished()) {
    console.log('Nothing to publish');
    process.exit();
  }

  setupGit();

  const tag = `v${packageJson.version}`;

  execSync('npm publish');
  execSync(`git tag -a ${tag} -m "${tag}"`);
  execSync('git push origin --tags');
};

release().catch(() => {
  console.log('Failed to publish or tag');
  exit(1);
});
