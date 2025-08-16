#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Deploying updated Firebase database rules from database-rules.json...');

// First ensure we're using the correct rules file
const rulesPath = path.join(__dirname, 'database-rules.json');
if (!fs.existsSync(rulesPath)) {
  console.error('Error: database-rules.json not found!');
  process.exit(1);
}

exec('firebase deploy --only database:rules', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log('Firebase database rules deployed successfully!');
});
