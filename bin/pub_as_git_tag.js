const { execSync } = require('child_process');
const moment = require('moment');

// Function to get the current date and time in the desired format
function getCurrentDateTime() {
  return moment().format('YYYY.MMDD.HHmm');
}

// Generate the tag name
const tagName = `v${getCurrentDateTime()}`;

// Create a tag
const tagCommand = `git tag -a ${tagName} -m '${tagName}'`;
execSync(tagCommand);

console.log(`Tag created: ${tagName}`);
// Push the tag
const pushCommand = 'git push --follow-tags';
execSync(pushCommand);

console.log(`Tags pushed successfully.`);
