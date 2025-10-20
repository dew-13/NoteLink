# Step-by-Step Guide: Setting Up Cloud Firestore for NoteLink

This guide will walk you through setting up Cloud Firestore from scratch for your NoteLink application.

---

## 📋 Prerequisites

- Google account
- Web browser
- Your NoteLink project files

---

## Part 1: Create Firebase Project (15 minutes)

### Step 1: Go to Firebase Console

1. Open your web browser
2. Navigate to: **https://console.firebase.google.com/**
3. Sign in with your Google account
4. Click the **"Create a project"** button (or **"Add project"** if you have existing projects)

---

### Step 2: Create New Project

1. **Enter Project Name:**
   - Type: `NoteLink` (or any name you prefer)
   - Click **Continue**

2. **Google Analytics (Optional):**
   - You'll see "Enable Google Analytics for this project"
   - Toggle **OFF** for simplicity (or leave ON if you want analytics)
   - Click **Continue** or **Create project**

3. **Wait for Setup:**
   - Firebase will create your project (takes 30-60 seconds)
   - You'll see a loading animation
   - Click **Continue** when done

4. **You're now in the Firebase Console!**
   - You should see your project dashboard

---

## Part 2: Enable Cloud Firestore (10 minutes)

### Step 3: Create Firestore Database

1. **Navigate to Firestore:**
   - In the left sidebar, find and click **"Firestore Database"**
   - (Icon looks like a database/cylinder)

2. **Click "Create database":**
   - You'll see a big button in the center
   - Click **"Create database"**

3. **Choose Database Mode:**
   - Two options will appear:
   
   **Option A: Production Mode (Recommended for this project)**
   - Select **"Start in production mode"**
   - Click **Next**
   
   **Option B: Test Mode (Alternative for quick testing)**
   - Select **"Start in test mode"**
   - Click **Next**
   - ⚠️ Note: Test mode allows open access for 30 days

4. **Choose Location:**
   - Select a Cloud Firestore location closest to you:
     - `us-east1` (South Carolina)
     - `us-central1` (Iowa)
     - `europe-west1` (Belgium)
     - `asia-southeast1` (Singapore)
     - Or any other region
   - ⚠️ **Important:** You cannot change this later!
   - Click **Enable**

5. **Wait for Database Creation:**
   - Takes about 1-2 minutes
   - You'll see "Provisioning Cloud Firestore"
   - When done, you'll see an empty database with "Start collection" button

---

### Step 4: Set Up Firestore Security Rules

1. **Go to Rules Tab:**
   - At the top of Firestore page, click the **"Rules"** tab
   - You'll see the default rules

2. **Copy and Paste These Rules:**
   - Delete all existing text
   - Paste the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Notes collection - user can only access their own notes
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

3. **Publish the Rules:**
   - Click the **"Publish"** button at the top
   - You'll see "Rules published successfully"

---

## Part 3: Enable Authentication (10 minutes)

### Step 5: Set Up Email/Password Authentication

1. **Navigate to Authentication:**
   - In the left sidebar, click **"Authentication"**
   - (Icon looks like a key/person)

2. **Get Started:**
   - Click **"Get started"** button
   - You'll see the "Sign-in method" tab

3. **Enable Email/Password:**
   - Find **"Email/Password"** in the list
   - Click on it
   - Toggle **"Enable"** switch to ON
   - Leave "Email link (passwordless sign-in)" OFF
   - Click **"Save"**
   - Status should now show "Enabled"

---

### Step 6: Set Up Google Sign-In

1. **Enable Google Provider:**
   - In the same "Sign-in method" tab
   - Find **"Google"** in the list
   - Click on it

2. **Configure Google Sign-In:**
   - Toggle **"Enable"** switch to ON
   - **Project support email:** Select your email from dropdown
   - Click **"Save"**
   - Status should now show "Enabled"

---

## Part 4: Get Frontend Configuration (10 minutes)

### Step 7: Register Web App

1. **Go to Project Settings:**
   - Click the **gear icon** (⚙️) next to "Project Overview" in the left sidebar
   - Select **"Project settings"**

2. **Add a Web App:**
   - Scroll down to "Your apps" section
   - Click the **Web icon** (`</>` symbol)

3. **Register Your App:**
   - **App nickname:** Type `NoteLink Web`
   - **Firebase Hosting:** Leave unchecked (for now)
   - Click **"Register app"**

4. **Copy Firebase Configuration:**
   - You'll see a code snippet like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "notelink-xxxxx.firebaseapp.com",
  projectId: "notelink-xxxxx",
  storageBucket: "notelink-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

5. **Save These Values:**
   - Keep this page open or copy these values
   - Click **"Continue to console"**

---

### Step 8: Create Frontend .env File

1. **Open Your Project:**
   - Open VS Code or your code editor
   - Navigate to: `e:\Projects\NoteLink\frontend`

2. **Create .env File:**
   - In the `frontend` folder, create a new file named `.env`
   - Copy the `.env.example` content or create new

3. **Fill in Firebase Configuration:**
   - Use the values from Step 7
   - Your `.env` should look like this:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=notelink-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=notelink-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=notelink-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

VITE_API_URL=http://localhost:5000/api
```

4. **Save the file** (Ctrl+S)

---

## Part 5: Get Backend Configuration (10 minutes)

### Step 9: Generate Service Account Key

1. **Go to Project Settings:**
   - Click the **gear icon** (⚙️) next to "Project Overview"
   - Select **"Project settings"**

2. **Navigate to Service Accounts:**
   - Click the **"Service accounts"** tab at the top
   - You'll see "Firebase Admin SDK" section

3. **Generate Private Key:**
   - Click **"Generate new private key"** button
   - A popup will appear: "Generate new private key?"
   - Click **"Generate key"**
   - A JSON file will download automatically
   - File name looks like: `notelink-xxxxx-firebase-adminsdk-xxxxx.json`

4. **⚠️ IMPORTANT - Keep This File Secure:**
   - This file contains sensitive credentials
   - Never commit it to Git
   - Never share it publicly

---

### Step 10: Set Up Backend Configuration

1. **Rename the Downloaded File:**
   - Find the downloaded JSON file
   - Rename it to: `serviceAccountKey.json`

2. **Move to Backend Folder:**
   - Copy/Move `serviceAccountKey.json`
   - Place it in: `e:\Projects\NoteLink\backend\`
   - Should be in the same folder as `server.js`

3. **Create Backend .env File:**
   - In the `backend` folder, create a file named `.env`
   
4. **Fill in Backend Configuration:**
   - Open the `.env` file
   - Add the following (replace with your values):

```env
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Firebase Project Configuration (get these from Firebase Console)
FIREBASE_PROJECT_ID=notelink-xxxxx
FIREBASE_DATABASE_URL=https://notelink-xxxxx.firebaseio.com
```

5. **Get Your Project ID:**
   - Go back to Firebase Console
   - Project Settings > General tab
   - Copy your **"Project ID"**
   - Replace `notelink-xxxxx` with your actual Project ID

6. **Database URL:**
   - Use format: `https://YOUR-PROJECT-ID.firebaseio.com`
   - Replace `YOUR-PROJECT-ID` with your actual Project ID

7. **Save the file** (Ctrl+S)

---

## Part 6: Verify Setup (5 minutes)

### Step 11: Check Your File Structure

Make sure you have these files:

```
NoteLink/
├── backend/
│   ├── .env                    ✅ Created with Firebase config
│   ├── serviceAccountKey.json  ✅ Downloaded from Firebase
│   ├── server.js               ✅ Already exists
│   └── package.json            ✅ Already exists
│
└── frontend/
    ├── .env                    ✅ Created with Firebase config
    ├── src/
    └── package.json            ✅ Already exists
```

---

### Step 12: Verify .gitignore Files

**Check backend/.gitignore includes:**
```
.env
serviceAccountKey.json
```

**Check frontend/.gitignore includes:**
```
.env
.env.local
```

---

## Part 7: Test Your Setup (10 minutes)

### Step 13: Install Dependencies

1. **Open PowerShell in VS Code** (Terminal > New Terminal)

2. **Install Backend Dependencies:**
```powershell
cd backend
npm install
```

3. **Install Frontend Dependencies:**
```powershell
cd ..\frontend
npm install
```

---

### Step 14: Start the Backend Server

```powershell
cd ..\backend
npm run dev
```

**Expected Output:**
```
🚀 Server is running on port 5000
📝 Environment: development
```

**If you see errors:**
- Check that `serviceAccountKey.json` exists in backend folder
- Verify `.env` file has correct values
- Make sure `FIREBASE_PROJECT_ID` matches your Firebase project

---

### Step 15: Start the Frontend (New Terminal)

1. **Open a NEW terminal** (Click + icon in VS Code terminal)

2. **Start Frontend:**
```powershell
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

3. **Open Your Browser:**
   - Navigate to: `http://localhost:3000`
   - You should see the NoteLink login page

---

### Step 16: Test Registration

1. **Click "Sign Up"** on the login page
2. **Enter test credentials:**
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. **Click "Sign up"**

**Success Indicators:**
- ✅ You're redirected to the Dashboard
- ✅ You see "My Notes" heading
- ✅ You see "New Note" button

4. **Check Firebase Console:**
   - Go to Firebase Console > Authentication > Users tab
   - You should see your test user listed

---

### Step 17: Test Creating a Note

1. **Click "New Note"** button
2. **Fill in:**
   - Title: `My First Note`
   - Description: `Testing Firestore database`
3. **Click "Create Note"**

**Success Indicators:**
- ✅ Modal closes
- ✅ Note appears on the dashboard
- ✅ No errors in browser console (F12)

4. **Verify in Firestore:**
   - Go to Firebase Console > Firestore Database > Data tab
   - You should see a `notes` collection
   - Click on it to see your note document

---

## 🎉 Congratulations!

Your Cloud Firestore setup is complete and working! You now have:

✅ Firebase project created  
✅ Cloud Firestore database enabled  
✅ Authentication configured (Email & Google)  
✅ Security rules set up  
✅ Frontend configured  
✅ Backend configured  
✅ Successfully tested  

---

## 🔧 Troubleshooting Common Issues

### Issue 1: "Firebase not initialized"
**Solution:**
- Check that all `VITE_FIREBASE_*` variables are in `frontend/.env`
- Restart the frontend server after editing .env
- Verify values match Firebase Console

### Issue 2: "Permission denied" errors
**Solution:**
- Check Firestore security rules are published
- Verify user is logged in
- Check browser console for specific error

### Issue 3: Backend won't start
**Solution:**
- Verify `serviceAccountKey.json` exists in backend folder
- Check `FIREBASE_PROJECT_ID` in backend `.env`
- Make sure port 5000 is not in use

### Issue 4: Can't create notes
**Solution:**
- Open browser console (F12)
- Check Network tab for API errors
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`

### Issue 5: Google Sign-In not working
**Solution:**
- Verify Google provider is enabled in Firebase Console
- Check that you selected a support email
- Try clearing browser cache/cookies

---

## 📚 Next Steps

Now that your Firestore is set up:

1. ✅ Test all CRUD operations (Create, Read, Update, Delete)
2. ✅ Try the search functionality
3. ✅ Test logout and login again
4. ✅ Try Google Sign-In
5. ✅ Create multiple notes
6. ✅ Test on different browsers

---

## 🔐 Security Reminders

- ✅ Never commit `.env` files to Git
- ✅ Never commit `serviceAccountKey.json` to Git
- ✅ Never share your Firebase credentials
- ✅ Review security rules before production deployment
- ✅ Enable Firebase App Check for production

---

## 📞 Need Help?

If you encounter issues:

1. Check the error message in the console
2. Review the Troubleshooting section above
3. Verify all configuration values
4. Check Firebase Console for status
5. Ensure both backend and frontend are running

---

**Happy Coding! 🚀**
