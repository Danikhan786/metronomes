# Firebase Google Authentication Setup

This guide will help you set up Google authentication with Firebase so that users can sign in with Google and be redirected to the dashboard with their data stored in Firestore.

## 1. Firebase Project Setup

You already have a Firebase project called "circular-metronome" with the service account JSON file. Now you need to:

### Enable Google Authentication in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your "circular-metronome" project
3. Go to "Authentication" in the left sidebar
4. Click "Get started" if not already done
5. Go to "Sign-in method" tab
6. Click on "Google" provider
7. Enable it and configure:
   - Project support email: your email
   - Authorized domains: add your domain (localhost for development)

### Get Firebase Web App Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (</>) to add a web app
4. Register your app with name "Metronome Web App"
5. Copy the configuration object

## 2. Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Apple Authentication (keep your existing values)
APPLE_ID_CLIENT_ID=your.app.bundle.id
APPLE_ID_TEAM_ID=your_team_id
APPLE_ID_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
APPLE_ID_KEY_ID=your_key_id

# Google Authentication (get these from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Firebase Configuration (Client-side) - Replace with your actual values
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=circular-metronome.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=circular-metronome
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=circular-metronome.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Configuration (Server-side) - Already configured from your service account
FIREBASE_PROJECT_ID=circular-metronome
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@circular-metronome.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCF00Us5VK36vtt\nXyKNGsyC5jW4P7jNmrUKSENVx9dRLvmVe/pGLHwx/7pkKSCUSHOh1t3rqtH4o4TX\noF2ePyuzvFGfF8UeszGjhmiy4NBjTrMOtTT0HQ0MQ7ezi4nPiY5Lh9oeJqZLlQS+\nMM7IdMjpPCi4SIr83aVdzNy66/H1gJLe60OSdMygZrW+LdeEct7Z2C5TxTaMpUVK\nGBY3HL7Ch0jVxdT4W04/b12uvwn2zpWR45KBACAf39CQJs9RTimySAv6BpgklMX4\naYbhwOTEHv9yQ/LIMxZKrJ0PlD9zwtO1XU4SB+UdfWj+KZBDxF1Vr9oJZ4phyfgl\nMBGxzJFfAgMBAAECggEANP4RnPMcO88Vi9xJwsVzaXw+lnzJMcWK3gz6ePvfA/tN\ngseqteIEtgnVZbcxevZrr5D1pM4qQkKCJp6Oo8zRAeXXDmArwvnjdKUTTY4fhsuR\ntQfFdcsRMSOZmUPuqNuIGNmtYhYc8L4MOEH8iD1Sl6UmXL8BJpugUZH/cBdhYzzZ\nk0nlV0vaTTOQtSAeTLRPGOFSa886C1VD9QpKFkzc4GFrv0lIbhVoWuKmfW9RQpDN\nreK6ci0QTiAimw29tSLOPoeEahnB01a93vZzPVjKTSrGhkS0WXPJIQLYobliY6BZ\neBafftkuA7Obn2q2Bxo0LFTbVcEgQ63eaKMQysr/VQKBgQC66djk4IB/+tReDWs/\nlEy7W19tP+uG/A4lEn8qoFNWymI1WO34n2tSQQ2wS66aiFDGg7OJb04vAs0s/ZRv\nqy5kWzk/nrxX3Va6yEHDELenQKqxIjv/eL2AlkgOAc1pEqsUH3Y/QI3wKqrAIsoW\nej6YwZydYbHgH88XWntwOQj5ywKBgQC3ShrA5RcZwAPQvxSLRhP63rODrybInsR/\n+/QtDyZMhM95pdwXKof/bHSDz9y+Oxdv3ZN2QYIsRPm7zY7ys3iA82OBeT34bwzT\nznVjGLn44ZsWJfnoNhJRJKCE40AdtvYb+4a8D1NPET0xj0eHsrQamhecN4Z+GdmD\n6r70Z4mkPQKBgEJ70VE/5ZUgFA/MOByqVEzEKIJEnTMrTqCzHpZ75ojVfe85zZOE\nqPjd+M9/bAC9gfXKfL7i321rUq2xGO5LdjnuFMPjY1zhdusDNhj7RkfwgYZ2Bd9O\nBCHL0p9g1r6MDFwhAL9o59PIaWnkNfueycst+tYkHM/6oH/PCF8XenDXAoGBAJV8\n+AL5FXUn+TSok43f0u3Z8pllIgGgE+26RXT2lSr1au3xS2cNhivZfdH/ly8DrOLM\n2bcqSIvombIFPiBOJesuFqsDgnp7v/+DtJPlF9CX2FAhGwi8CQZrFAwt+B4EGgfK\nhiIdcbnb+ofQLuvK4T+NC9KaKrPwS0pfC+z0APuVAoGBAJBdcV2MPfWgG6J/rI0W\nYcSNuSFD8ZoXkyl08nbtr62ukrzx4JzF16LG51kFp1PSyNR0OfuMNOttoqBfGNdg\nP7mVaMmgyoLTVR8LW6fjBGdyuggSApxivGjwVK46gMJhgOSl63md41XhsS7zwERW\n05xYtkVCMNwT7LtAVjcFwxsD\n-----END PRIVATE KEY-----\n"
```

## 3. Google OAuth Setup

### Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (should be the same as Firebase project)
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret to your `.env.local` file

## 4. Install Firebase Dependencies

Run this command to install Firebase:

```bash
npm install firebase firebase-admin
# or
pnpm add firebase firebase-admin
# or
yarn add firebase firebase-admin
```

## 5. Firestore Security Rules

Update your Firestore security rules in Firebase Console:

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

## 6. Testing the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/auth/signin`

3. Click "Sign in with Google"

4. You should be redirected to Google's OAuth consent screen

5. After successful authentication, you'll be redirected to `/dashboard`

6. Check your Firestore database to see the user data being stored

## 7. How It Works

### Authentication Flow

1. User clicks "Sign in with Google" button
2. NextAuth redirects to Google OAuth
3. User authenticates with Google
4. Google redirects back to your app with authorization code
5. NextAuth exchanges code for tokens
6. Firebase adapter creates/updates user in Firestore
7. User is redirected to dashboard
8. Session is maintained using JWT tokens

### Data Storage

The Firebase adapter automatically creates these collections in Firestore:

- `users` - User profiles with name, email, image, etc.
- `accounts` - OAuth account links (Google, Apple)
- `sessions` - User sessions for authentication
- `verificationTokens` - Email verification tokens

### User Data Structure

Each user document in Firestore contains:
```json
{
  "id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "emailVerified": "2024-01-01T00:00:00.000Z",
  "image": "https://lh3.googleusercontent.com/...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 8. Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**: Make sure your redirect URIs in Google Cloud Console match exactly
2. **"Firebase not initialized"**: Check that all environment variables are set correctly
3. **"Permission denied"**: Verify your Firestore security rules
4. **"Client ID not found"**: Ensure your Google OAuth credentials are correct

### Debug Mode

Enable debug mode in NextAuth by setting:
```env
NEXTAUTH_DEBUG=true
```

This will show detailed logs in your console.

## 9. Production Deployment

1. Update environment variables for production
2. Set up proper domain in Google OAuth
3. Configure Firestore security rules for production
4. Enable Firebase Authentication providers for production
5. Set up proper CORS and CSP headers

## 10. Next Steps

After successful setup, you can:

1. Add more OAuth providers (GitHub, Twitter, etc.)
2. Implement user profile management
3. Add role-based access control
4. Set up email verification
5. Add password reset functionality
6. Implement user preferences and settings

Your Google authentication with Firebase is now ready! Users will be able to sign in with Google and their data will be stored securely in Firestore. 