# Firebase Setup Guide

## Firebase Project Configuration

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enter project name (e.g., "NoteLink")
4. Follow the setup wizard

### 2. Enable Authentication Methods

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: Click on it and enable
   - **Google**: Click on it, enable, and configure support email

### 3. Create Firestore Database

1. Go to **Firestore Database** in the left menu
2. Click "Create database"
3. Choose **Production mode** or **Test mode** (for development)
4. Select a database location (choose closest to your users)

### 4. Set up Firestore Security Rules

In Firestore Database > Rules, add these security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Notes collection - users can only access their own notes
    match /notes/{noteId} {
      // Allow read if authenticated and note belongs to user
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      
      // Allow create if authenticated and userId matches
      allow create: if request.auth != null && 
                      request.auth.uid == request.resource.data.userId;
      
      // Allow update/delete if authenticated and note belongs to user
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.userId;
    }
  }
}
```

### 5. Get Frontend Configuration (Web App)

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click on the **Web** icon (`</>`)
4. Register your app with a nickname (e.g., "NoteLink Web")
5. Copy the Firebase configuration object

Create `.env` file in the `frontend` directory:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id

VITE_API_URL=http://localhost:5000/api
```

### 6. Get Backend Configuration (Service Account)

1. In Firebase Console, go to **Project Settings** > **Service Accounts**
2. Click "Generate new private key"
3. Download the JSON file
4. Rename it to `serviceAccountKey.json`
5. Place it in the `backend` directory

Create `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

### 7. Firestore Collection Structure

The application uses the following Firestore structure:

```
notes (collection)
  ├── {noteId} (document)
      ├── userId: string
      ├── title: string
      ├── description: string
      ├── createdAt: string (ISO 8601)
      └── updatedAt: string (ISO 8601)
```

### 8. Security Best Practices

- ✅ Never commit `serviceAccountKey.json` to version control
- ✅ Never commit `.env` files to version control
- ✅ Use environment variables for all sensitive data
- ✅ Enable Firebase App Check for production
- ✅ Review and test Firestore security rules thoroughly
- ✅ Set up Firebase usage quotas and alerts

### 9. Optional: Enable Firebase App Check (Production)

1. Go to **App Check** in Firebase Console
2. Register your app
3. Configure reCAPTCHA v3 or other providers
4. Enforce App Check for Firestore

## Troubleshooting

### Issue: "Permission denied" errors
- Check Firestore security rules
- Verify user is authenticated
- Ensure userId matches in the document

### Issue: "Firebase not initialized"
- Verify all environment variables are set
- Check Firebase configuration values
- Ensure serviceAccountKey.json is in the correct location

### Issue: Authentication errors
- Verify Email/Password and Google auth are enabled
- Check authorized domains in Firebase Console (Authentication > Settings)
