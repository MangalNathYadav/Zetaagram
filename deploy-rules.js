/**
 * Deploy Firebase Realtime Database Rules
 * 
 * This script uploads the database rules from database-rules.json to Firebase
 * Run with: node deploy-rules.js
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

// Deploy database rules
try {
  console.log('Deploying database rules...');
  execSync('firebase deploy --only database', { stdio: 'inherit' });
  console.log('Database rules successfully deployed!');
} catch (error) {
  console.error('Error deploying database rules:', error.message);
  process.exit(1);
}
