"use client";

/**
 * Script to create necessary folders for avatars during app initialization
 */

import fs from 'fs';
import path from 'path';

const ensureAvatarsFolder = () => {
  // Define paths
  const publicDir = path.join(process.cwd(), 'public');
  const avatarsDir = path.join(publicDir, 'avatars');
  
  // Check if public directory exists, if not create it
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  
  // Check if avatars directory exists, if not create it
  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir);
  }
  
  console.log('Avatars directory structure verified');
};

// Only run in development or during build
if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
  try {
    ensureAvatarsFolder();
  } catch (error) {
    console.error('Error ensuring avatar folders:', error);
  }
}

export { ensureAvatarsFolder };
