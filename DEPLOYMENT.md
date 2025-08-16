# Zetagram Firebase Deployment

This document explains how to deploy the Zetagram application to Firebase Hosting.

## Prerequisites

1. Make sure you have Firebase CLI installed:
   ```
   npm install -g firebase-tools
   ```

2. Log in to Firebase:
   ```
   firebase login
   ```

## Deployment Steps

1. Build your Next.js application:
   ```
   npm run build
   ```

2. Initialize Firebase (if not already done):
   ```
   firebase init
   ```
   
   - Select "Hosting: Configure files for Firebase Hosting"
   - Select your Firebase project
   - Use `.next` as your public directory
   - Configure as a single-page app
   - Don't overwrite `index.html`

3. Deploy to Firebase:
   ```
   firebase deploy
   ```

## Firebase Rules Deployment

To deploy the database rules:

1. Copy the contents of `database-rules.json` file.

2. Go to the Firebase Console.

3. Navigate to Realtime Database → Rules.

4. Paste the rules and click "Publish".

## Troubleshooting

- If you encounter any issues with deployment, check the Firebase CLI logs for details.
- Make sure your Firebase project has Hosting enabled.
- If you're getting authentication errors, try running `firebase logout` and then `firebase login` again.

## Environment Variables

Make sure you have the following environment variables set in your Firebase project:

- For production deployments, set these in the Firebase Console under Project Settings → Environment Variables.
- For local development, use a `.env.local` file.

Required variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
