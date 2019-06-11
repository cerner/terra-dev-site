// eslint-disable-next-line import/no-extraneous-dependencies, no-unused-vars, object-curly-newline
import { danger, fail } from 'danger';

const newChangelog = danger.git.created_files.filter((filePath) => {
  const srcFilePattern = /CHANGELOG\.md/i;
  return srcFilePattern.test(filePath);
});

const modifiedChangelog = danger.git.modified_files.filter((filePath) => {
  const srcFilePattern = /CHANGELOG\.md/i;
  return srcFilePattern.test(filePath);
});

const modifiedSrcFiles = danger.git.modified_files.filter((filePath) => {
  const srcFilePattern = /\/src/i;
  return srcFilePattern.test(filePath);
});

const modifiedConfigFiles = danger.git.modified_files.filter((filePath) => {
  const configFilePattern = /\/config/i;
  return configFilePattern.test(filePath);
});

const modifiedGenerateConfigScriptFiles = danger.git.modified_files.filter((filePath) => {
  const srcFilePattern = /\/scripts\/generate-app-config/i;
  return srcFilePattern.test(filePath);
});

const hasCHANGELOGChanges = modifiedChangelog.length > 0 || newChangelog.length > 0;
const hasModifiedSrcFiles = modifiedSrcFiles.length > 0;
const hasModifiedConfigFiles = modifiedConfigFiles.length > 0;
const hasModifiedGenerateConfigScriptFiles = modifiedGenerateConfigScriptFiles.length > 0;

// Fail if there are src code changes without a CHANGELOG update
if ((hasModifiedSrcFiles || hasModifiedConfigFiles || hasModifiedGenerateConfigScriptFiles) && !hasCHANGELOGChanges) {
  fail('Please include a CHANGELOG entry with this PR.');
}
