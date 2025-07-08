# Firebase Setup Guide

This project has been migrated from Prisma to Firebase for user data storage. Follow these steps to set up Firebase:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Enable the sign-in methods you want to use:
   - Google
   - Apple (if you're using Apple Sign-In)

## 3. Set up Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database

## 4. Get Firebase Configuration

### Client-side Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (</>) to add a web app
4. Register your app and copy the configuration
5. Add these values to your `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Server-side Configuration

1. Go to Project Settings > Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Add these values to your `.env.local` file:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
```

## 5. Install Dependencies

Run the following command to install Firebase dependencies:

```bash
npm install firebase firebase-admin
# or
pnpm add firebase firebase-admin
# or
yarn add firebase firebase-admin
```

## 6. Firestore Security Rules

Update your Firestore security rules to allow authenticated access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to manage their sessions
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to manage their accounts
    match /accounts/{accountId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow verification tokens (used by NextAuth)
    match /verificationTokens/{tokenId} {
      allow read, write: if true;
    }
  }
}
```

## 7. Collection Structure

The Firebase adapter will automatically create these collections:

- `users` - User profiles
- `accounts` - OAuth account links
- `sessions` - User sessions
- `verificationTokens` - Email verification tokens

## 8. Migration from Prisma

If you have existing data in Prisma, you can migrate it to Firebase:

1. Export your data from Prisma
2. Use the Firebase Admin SDK to import the data
3. Update any references to use Firebase document IDs

## 9. Testing

1. Start your development server: `npm run dev`
2. Test user registration and login
3. Verify that user data is being stored in Firestore

## 10. Production Deployment

1. Update your environment variables in your hosting platform
2. Set up proper Firestore security rules
3. Enable Firebase Authentication providers for production
4. Consider setting up Firebase Analytics and Performance Monitoring

## Troubleshooting

### Common Issues

1. **Firebase not initialized**: Make sure all environment variables are set correctly
2. **Permission denied**: Check your Firestore security rules
3. **Authentication errors**: Verify your OAuth provider configurations

### Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) 