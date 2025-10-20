# Quick Fix Guide for Backend Errors

## ✅ Issues Fixed
- Circular dependency warning (fixed by separating Firebase config)

## 🔧 Issues to Fix

### Error 1: "Cannot find module './serviceAccountKey.json'"

**Solution:**

1. **Download Service Account Key from Firebase:**
   - Go to Firebase Console: https://console.firebase.google.com/
   - Select your project (notelink-238fd)
   - Click the gear icon ⚙️ > Project Settings
   - Go to "Service accounts" tab
   - Click "Generate new private key"
   - Save the downloaded file

2. **Rename and Move the File:**
   - Rename the downloaded file to: `serviceAccountKey.json`
   - Move it to: `e:\Projects\NoteLink\backend\`
   - Should be in the same folder as `server.js`

3. **Verify the file is there:**
   ```powershell
   cd e:\Projects\NoteLink\backend
   dir serviceAccountKey.json
   ```

---

### Error 2: Missing `.env` file

**Solution:**

1. **Create `.env` file in backend folder:**
   ```powershell
   cd e:\Projects\NoteLink\backend
   copy .env.example .env
   ```

2. **Edit `.env` file with your values:**
   
   Open `e:\Projects\NoteLink\backend\.env` and update:

   ```env
   PORT=5000
   NODE_ENV=development
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000
   
   # Firebase Admin SDK
   FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
   
   # Firebase Project Configuration
   FIREBASE_PROJECT_ID=notelink-238fd
   FIREBASE_DATABASE_URL=https://notelink-238fd.firebaseio.com
   ```

3. **Save the file**

---

## 🚀 After Fixing - Restart the Server

```powershell
cd e:\Projects\NoteLink\backend
npm run dev
```

**Expected Output:**
```
🚀 Server is running on port 5000
📝 Environment: development
```

---

## ✅ Checklist

- [ ] Download serviceAccountKey.json from Firebase Console
- [ ] Place serviceAccountKey.json in backend folder
- [ ] Create .env file (copy from .env.example)
- [ ] Update .env with correct values
- [ ] Restart server with `npm run dev`

---

## 📁 Your Backend Folder Should Look Like:

```
backend/
├── config/
│   └── firebase.js        ✅ (newly created)
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   └── notes.js
├── .env                   ⚠️ (you need to create this)
├── .env.example           ✅
├── .gitignore             ✅
├── package.json           ✅
├── server.js              ✅
└── serviceAccountKey.json ⚠️ (you need to download this)
```

---

## 🔒 Security Reminder

**NEVER commit these files to Git:**
- ❌ `.env`
- ❌ `serviceAccountKey.json`

They should already be in `.gitignore`
