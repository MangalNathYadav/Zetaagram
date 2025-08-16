#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to execute commands and log output
function runCommand(command) {
  console.log(`\n\x1b[36m> ${command}\x1b[0m\n`);
  try {
    const output = execSync(command, { stdio: 'inherit' });
    return { success: true, output };
  } catch (error) {
    console.error(`\x1b[31mCommand failed: ${error.message}\x1b[0m`);
    return { success: false, error };
  }
}

// Check if firebase is installed
function checkFirebaseInstalled() {
  try {
    execSync('firebase --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Main deploy function
async function deployApp() {
  console.log('\x1b[35m=== Zetagram Deployment ===\x1b[0m\n');
  
  // 1. Check if Firebase CLI is installed
  if (!checkFirebaseInstalled()) {
    console.log('\x1b[33mFirebase CLI is not installed. Installing now...\x1b[0m');
    runCommand('npm install -g firebase-tools');
  }
  
  // 2. Ask for environment
  const askEnv = () => new Promise((resolve) => {
    rl.question('\x1b[36mDeploy to production? (y/n): \x1b[0m', (answer) => {
      resolve(answer.toLowerCase() === 'y');
    });
  });
  
  const isProduction = await askEnv();
  const envFile = isProduction ? '.env.production' : '.env.development';
  
  // 3. Build the app with the right environment
  console.log(`\n\x1b[35mBuilding for ${isProduction ? 'production' : 'development'}...\x1b[0m`);
  
  // Install dependencies if needed
  if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
    console.log('\x1b[33mNode modules not found. Installing dependencies...\x1b[0m');
    runCommand('npm install');
  }
  
  // Build the app
  const buildResult = runCommand('npm run build');
  if (!buildResult.success) {
    console.error('\x1b[31mBuild failed. Aborting deployment.\x1b[0m');
    rl.close();
    return;
  }
  
  // 4. Firebase login
  console.log('\n\x1b[35mChecking Firebase authentication...\x1b[0m');
  runCommand('firebase login:list');
  
  // Ask user if they need to login
  const askLogin = () => new Promise((resolve) => {
    rl.question('\x1b[36mNeed to login to Firebase? (y/n): \x1b[0m', (answer) => {
      resolve(answer.toLowerCase() === 'y');
    });
  });
  
  const needsLogin = await askLogin();
  if (needsLogin) {
    runCommand('firebase login');
  }
  
  // 5. Deploy to Firebase
  console.log('\n\x1b[35mDeploying to Firebase...\x1b[0m');
  const deployResult = runCommand('firebase deploy');
  
  if (deployResult.success) {
    console.log('\n\x1b[32m✅ Deployment completed successfully!\x1b[0m');
  } else {
    console.error('\n\x1b[31m❌ Deployment failed.\x1b[0m');
  }
  
  // Reminder about database rules
  console.log('\n\x1b[33mReminder: Don\'t forget to copy the database rules from database-rules.json to your Firebase console.\x1b[0m');
  
  rl.close();
}

// Execute the deployment
deployApp().catch(error => {
  console.error('\x1b[31mAn error occurred:', error, '\x1b[0m');
  rl.close();
});
