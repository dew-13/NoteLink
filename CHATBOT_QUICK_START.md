# Chatbot Quick Start

## Minimal Setup to Get Started

### 1. Get Your Dialogflow Project ID

1. Go to [Dialogflow Console](https://dialogflow.cloud.google.com/)
2. Select your agent
3. Click the settings gear icon (⚙️) next to your agent name
4. Copy the **Project ID** (looks like: `your-project-name-abc123`)

### 2. Download Service Account Key

**Option A: Use existing Firebase key (if it has Dialogflow permissions)**
- Your existing `backend/serviceAccountKey.json` might already work
- Skip to step 3 to test it

**Option B: Download new key**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Menu > IAM & Admin > Service Accounts
4. Click on your service account email
5. Keys tab > Add Key > Create New Key > JSON
6. Save as `serviceAccountKey.json` in `backend/` folder

### 3. Enable Dialogflow API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Menu > APIs & Services > Library
4. Search for "Dialogflow API"
5. Click it and press "Enable"

### 4. Update Environment Variables

Edit `backend/.env` (or create it from `.env.example`):

```env
DIALOGFLOW_PROJECT_ID=your-actual-project-id
DIALOGFLOW_KEY_FILE=./serviceAccountKey.json
```

### 5. Create Basic Intents in Dialogflow

At minimum, create these intents:

**Default Welcome Intent** (usually exists by default)
- Just make sure it has a response

**Help Intent**
- Training phrases: "help", "what can you do", "how does this work"
- Response: "I can help you with creating notes, searching, organizing, and managing your notes!"

### 6. Start Your Application

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 7. Test the Chatbot

1. Open your app in browser (usually http://localhost:5173)
2. Look for the blue chat icon in bottom-right corner
3. Click it and type "hello" or "help"

## Troubleshooting

### "Failed to process chatbot query"

**Check:**
1. Is `DIALOGFLOW_PROJECT_ID` correct in `.env`?
2. Does `backend/serviceAccountKey.json` exist?
3. Is Dialogflow API enabled?
4. Does your service account have Dialogflow permissions?

**Quick Fix:**
```bash
cd backend
# Check if env file exists
cat .env

# Restart the backend
npm run dev
```

### No response from chatbot

**Check browser console (F12):**
- Network tab: Is the request to `/api/chatbot/query` failing?
- Console tab: Any error messages?

**Check backend logs:**
- Look for error messages in the terminal running `npm run dev`

### Still not working?

1. Test your Dialogflow agent directly:
   - Go to Dialogflow Console
   - Use the "Try it now" panel on the right
   - Type "hello" - does it respond?

2. Verify backend route:
   - Open: http://localhost:5000/api/health
   - Should return: `{"status":"success",...}`

## What's Next?

Once basic chatbot works:

1. **Add more intents** - See `CHATBOT_SETUP_GUIDE.md` for examples
2. **Customize responses** - Make them specific to your app
3. **Add rich responses** - Cards, quick replies, buttons
4. **Integrate actions** - Make bot trigger app features

For detailed setup and advanced features, see `CHATBOT_SETUP_GUIDE.md`.
