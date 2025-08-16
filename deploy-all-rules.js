/**
 * Deploy Firebase Database Rules
 * 
 * This script uploads database rules to Firebase
 * Run with: node deploy-all-rules.js
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

// Update firebase.json configuration
try {
  console.log('Updating Firebase configuration...');
  
  const firebaseConfigPath = path.join(__dirname, 'firebase.json');
  let firebaseConfig;
  
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
  } catch (error) {
    console.error('Error reading firebase.json file, creating new one');
    firebaseConfig = {};
  }
  
  // Add database configuration
  if (!firebaseConfig.database) {
    firebaseConfig.database = {
      rules: 'database-rules.json'
    };
  } else {
    firebaseConfig.database.rules = 'database-rules.json';
  }
  
  // Remove any storage configuration if it exists
  if (firebaseConfig.storage) {
    delete firebaseConfig.storage;
  }
  
  // Write the updated config back to firebase.json
  fs.writeFileSync(firebaseConfigPath, JSON.stringify(firebaseConfig, null, 2), 'utf8');
  console.log('Updated firebase.json with database rules configuration');
  
  // Deploy database rules
  console.log('Deploying Firebase database rules...');
  execSync('firebase deploy --only database', { stdio: 'inherit' });
  console.log('Database rules deployed successfully!');
} catch (error) {
  console.error('Error deploying rules:', error);
  process.exit(1);
}
