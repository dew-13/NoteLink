# Dialogflow Chatbot Integration Guide

This guide will help you integrate Dialogflow chatbot into your NoteLink application.

## Prerequisites

1. You have already created a Dialogflow agent in Google Cloud Console
2. You have a Google Cloud project with Dialogflow API enabled
3. You have a service account with appropriate permissions

## Setup Steps

### 1. Get Dialogflow Credentials

#### Option A: Download Service Account Key (Recommended for Development)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **IAM & Admin** > **Service Accounts**
4. Find your service account or create a new one with these roles:
   - Dialogflow API Client
   - Dialogflow API Admin (if needed)
5. Click on the service account
6. Go to **Keys** tab
7. Click **Add Key** > **Create New Key**
8. Choose **JSON** format
9. Download the key file

#### Option B: Use the Same Firebase Service Account

If your Firebase service account has Dialogflow permissions, you can use the same `serviceAccountKey.json` file.

### 2. Configure Backend

1. Place your service account key file in the backend directory:
   ```
   backend/serviceAccountKey.json
   ```

2. Create or update `.env` file in the backend directory:
   ```env
   # Dialogflow Configuration
   DIALOGFLOW_PROJECT_ID=your-project-id
   DIALOGFLOW_KEY_FILE=./serviceAccountKey.json
   
   # Existing configuration...
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

3. Get your Project ID from [Google Cloud Console](https://console.cloud.google.com/)

### 3. Configure Dialogflow Agent

#### Create Intents in Dialogflow

Here are some sample intents for NoteLink:

**Intent: Default Welcome**
- Training phrases: "Hi", "Hello", "Hey"
- Response: "Hi! I'm your NoteLink assistant. I can help you with creating notes, searching, organizing, and more. What would you like to do?"

**Intent: Create Note**
- Training phrases:
  - "Create a note"
  - "I want to make a new note"
  - "Add a note"
  - "New note"
- Response: "I can help you create a note! You can click the '+' button in your dashboard to create a new note."

**Intent: Search Notes**
- Training phrases:
  - "Find my notes"
  - "Search for a note"
  - "How do I search?"
  - "Look for notes about meetings"
- Response: "You can search your notes using the search bar at the top of your dashboard. Just type keywords from your note title or description."

**Intent: Delete Note**
- Training phrases:
  - "How do I delete a note?"
  - "Remove a note"
  - "Delete notes"
- Response: "To delete a note, click the trash icon on the note card. The note will be moved to the bin where you can restore it or permanently delete it."

**Intent: Categories**
- Training phrases:
  - "What categories are available?"
  - "How do I organize notes?"
  - "Tell me about categories"
- Response: "NoteLink supports several categories: Personal, Work, Ideas, and To-Do. You can select a category when creating or editing a note to keep things organized!"

**Intent: Important Notes**
- Training phrases:
  - "Mark note as important"
  - "How do I star a note?"
  - "Important notes"
- Response: "You can mark any note as important by clicking the star icon. Important notes are highlighted and can be filtered using the sidebar."

**Intent: Archive**
- Training phrases:
  - "Archive a note"
  - "How do I archive?"
  - "What is archive?"
- Response: "You can archive notes you want to keep but don't need to see regularly. Click the archive icon on any note card. Archived notes can be viewed from the Archive section in the sidebar."

**Intent: Help**
- Training phrases:
  - "Help"
  - "What can you do?"
  - "Features"
  - "How does this work?"
- Response: "I can help you with:
  • Creating and editing notes
  • Searching and organizing notes
  • Understanding categories and labels
  • Managing important notes
  • Using the archive and bin features
  • Keyboard shortcuts and tips
  
  What would you like to know more about?"

### 4. Test the Integration

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start your frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to your app
4. Look for the blue chat icon in the bottom-right corner
5. Click it to open the chatbot and start chatting!

## Troubleshooting

### Error: "Failed to process chatbot query"

**Solution:**
- Check if `DIALOGFLOW_PROJECT_ID` is correctly set in `.env`
- Verify your service account key file path
- Ensure the service account has Dialogflow API permissions
- Check if Dialogflow API is enabled in your Google Cloud project

### Error: "GOOGLE_APPLICATION_CREDENTIALS not set"

**Solution:**
- Make sure your `.env` file has `DIALOGFLOW_KEY_FILE` set
- Or set the environment variable:
  ```bash
  # Windows PowerShell
  $env:GOOGLE_APPLICATION_CREDENTIALS="path\to\serviceAccountKey.json"
  
  # Linux/Mac
  export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"
  ```

### Chatbot not responding

**Solution:**
- Open browser developer tools (F12) and check for console errors
- Check backend logs for error messages
- Verify your Dialogflow agent has intents configured
- Test your Dialogflow agent directly in Dialogflow Console

### CORS errors

**Solution:**
- Make sure your frontend URL is whitelisted in backend CORS configuration
- Check `server.js` CORS settings match your frontend URL

## Advanced Features

### 1. Context Management

You can maintain conversation context by storing the sessionId:

```javascript
// In Chatbot.jsx
const [sessionId] = useState(() => {
  const stored = localStorage.getItem('chatbotSessionId');
  if (stored) return stored;
  const newId = `notelink-${Date.now()}`;
  localStorage.setItem('chatbotSessionId', newId);
  return newId;
});
```

### 2. Rich Responses

Modify the chatbot route to handle rich responses:

```javascript
// In backend/routes/chatbot.js
const messages = result.fulfillmentMessages;
const richResponses = messages.map(msg => {
  if (msg.card) return { type: 'card', data: msg.card };
  if (msg.quickReplies) return { type: 'quick_replies', data: msg.quickReplies };
  return { type: 'text', data: msg.text };
});
```

### 3. Intent-Based Actions

Handle specific intents to trigger actions in your app:

```javascript
// In frontend, after receiving bot response
if (response.intent === 'Create Note') {
  // Open note creation modal
  setIsModalOpen(true);
}
```

### 4. User Authentication Integration

Pass user context to Dialogflow:

```javascript
// In Chatbot.jsx
import { useAuth } from '../context/AuthContext';

const { currentUser } = useAuth();

const sendMessageToDialogflow = async (message) => {
  const response = await axios.post('/api/chatbot/query', {
    message,
    sessionId,
    userId: currentUser?.uid // Pass user ID for personalization
  });
  // ...
};
```

## Production Deployment

### Environment Variables

Make sure to set these in your production environment:

```env
DIALOGFLOW_PROJECT_ID=your-production-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/production/key.json
```

### Security Considerations

1. **Never commit service account keys to version control**
   - Add `serviceAccountKey.json` to `.gitignore`
   - Use environment variables or secret managers in production

2. **Rate Limiting**
   - Implement rate limiting on the chatbot endpoint to prevent abuse
   
3. **Authentication**
   - Consider adding authentication to chatbot endpoints
   - Verify user sessions before processing requests

4. **Input Validation**
   - Sanitize user inputs before sending to Dialogflow
   - Implement message length limits

## Resources

- [Dialogflow Documentation](https://cloud.google.com/dialogflow/docs)
- [Node.js Client Library](https://googleapis.dev/nodejs/dialogflow/latest/)
- [Best Practices](https://cloud.google.com/dialogflow/docs/best-practices)

## Support

If you encounter any issues:
1. Check the console logs (both frontend and backend)
2. Verify your Dialogflow agent configuration
3. Test intents directly in Dialogflow Console
4. Check Google Cloud Console for API quotas and errors
