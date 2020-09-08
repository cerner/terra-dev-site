#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const packageFile = path.resolve('package.json');
const changelogFile = path.resolve('CHANGELOG.md');
const releaseDate = new Date().toLocaleString('en-us', { month: 'long', year: 'numeric', day: 'numeric' });

if (!fs.existsSync(packageFile) || !fs.existsSync(changelogFile)) {
  return;
}

// Read package.json and pull out version
fs.readFile(packageFile, 'utf8', (err, packageJson) => {
  if (err) {
    console.error(`Error reading file ${packageFile} ${err}\n`);
  } else {
    // This is expected to be run after the packages are versioned.
    const { version } = JSON.parse(packageJson);

    const regex = /## Unreleased\n*([^#]*)/;

    const changelog = fs.readFileSync(changelogFile, 'utf8');

    // Grab any content in the unreleased section until the next heading (#).
    const unreleasedContent = changelog.match(regex);

    // Default message
    let releaseContent = [
      '* Changed',
      '  * Minor dependency version bump',
      '',
      '',
    ].join('\n');

    const [, captureGroup] = unreleasedContent;

    // If there was content, don't use the default content.
    if (captureGroup) {
      releaseContent = captureGroup;
    }

    // setup change log entry
    const changelogDoc = [
      '## Unreleased',
      '',
      `## ${version} - (${releaseDate})`,
      '',
      releaseContent,
    ].join('\n');

    // Swap in change log entry
    const updatedChangelog = changelog.replace(regex, changelogDoc);

    // write out file.
    fs.writeFileSync(changelogFile, updatedChangelog, { encoding: 'utf8', flag: 'w' });
  }
});
