# Zetagram

Zetagram is a social media platform built with Next.js and Firebase, featuring real-time posts, stories, likes, comments, and notifications.

## Implementation Details

### 1. Firebase Integration
- **Realtime Database**: Posts, stories, likes, comments, and notifications
- **Authentication**: User signup, login, and profile management
- **Base64 Image Storage**: Images are optimized and stored as Base64 strings in the Realtime Database

### 2. Key Features
- Real-time feed with posts and stories
- Like and comment on posts
- View and create stories
- User profiles and follow system
- Notifications for likes, comments, and follows
- Dark mode support
- Responsive design for mobile and desktop

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Firebase Configuration

This app requires Firebase configuration. Make sure you have:
1. Set up a Firebase project with Authentication and Realtime Database
2. Updated the Firebase config in `lib/firebase.ts` with your project credentials
3. Applied the security rules from `database-rules.json` to your Firebase Realtime Database

## Deployment

### Deploy to Firebase

1. Run the deployment script:

```bash
npm run deploy
```

2. Follow the prompts to deploy to Firebase Hosting

For detailed deployment instructions, see the `DEPLOYMENT.md` file.

## Recent Changes

1. **Removed Header from Home Page**: Header is not shown after user login
2. **Firebase Integration**: Complete integration with Firebase Realtime Database
3. **Base64 Image Handling**: Images are optimized and stored as Base64 strings
4. **Security Rules**: Comprehensive security rules for all Firebase services
5. **Deployment Configuration**: Easy deployment to Firebase Hosting
