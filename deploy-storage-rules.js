/**
 * Deploy Firebase Storage Rules
 * 
 * This script uploads the storage rules from storage-rules.json to Firebase
 * Run with: node deploy-storage-rules.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure Firebase CLI is installed
try {
  console.log('Checking Firebase CLI installation...');
  execSync('firebase --version', { stdio: 'inherit' });
} catch (error) {
  console.error('Firebase CLI is not installed. Please install it with: npm install -g firebase-tools');
  process.exit(1);
}

// Check if the user is logged in
try {
  console.log('Checking Firebase login status...');
  execSync('firebase projects:list', { stdio: 'pipe' });
} catch (error) {
  console.error('You are not logged into Firebase. Please login with: firebase login');
  process.exit(1);
}

// Deploy storage rules
try {
  console.log('Deploying Firebase Storage rules...');
  
  // Update the firebase.json file with the storage rules
  const firebaseConfigPath = path.join(__dirname, 'firebase.json');
  let firebaseConfig;
  
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
  } catch (error) {
    console.error('Error reading firebase.json file:', error);
    firebaseConfig = {};
  }
  
  // Add storage configuration if not present
  if (!firebaseConfig.storage) {
    firebaseConfig.storage = {
      rules: 'storage-rules.json'
    };
  } else {
    firebaseConfig.storage.rules = 'storage-rules.json';
  }
  
  // Write the updated config back to firebase.json
  fs.writeFileSync(firebaseConfigPath, JSON.stringify(firebaseConfig, null, 2), 'utf8');
  console.log('Updated firebase.json with storage rules configuration');
  
  // Deploy only storage rules
  execSync('firebase deploy --only storage', { stdio: 'inherit' });
  console.log('Storage rules deployed successfully!');
} catch (error) {
  console.error('Error deploying storage rules:', error);
  process.exit(1);
}
