# NoteLink Backend API

RESTful API backend for NoteLink note-taking application built with Node.js, Express, and Firebase.

## 🚀 Features

- **Firebase Authentication**: Secure user authentication with Firebase Admin SDK
- **RESTful API**: Clean and intuitive API endpoints
- **JWT Token Verification**: Middleware for protecting routes
- **CRUD Operations**: Full note management functionality
- **CORS Support**: Configured for frontend integration
- **Error Handling**: Comprehensive error handling middleware
- **Security**: Helmet.js for security headers

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Firestore enabled
- Firebase service account key

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     copy .env.example .env
     ```
   
   - Fill in your Firebase credentials in `.env`

3. **Add Firebase Service Account Key:**
   - Download `serviceAccountKey.json` from Firebase Console
   - Place it in the `backend` directory
   - Ensure it's listed in `.gitignore`

## 🏃‍♂️ Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT)

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

### Endpoints

#### Health Check
```http
GET /api/health
```
Check if the API is running.

**Response:**
```json
{
  "status": "success",
  "message": "NoteLink API is running",
  "timestamp": "2025-10-20T10:30:00.000Z"
}
```

---

#### Verify Token
```http
POST /api/auth/verify
```
Verify Firebase ID token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Token is valid",
  "user": {
    "uid": "user-id",
    "email": "user@example.com",
    "emailVerified": true
  }
}
```

---

#### Get Current User
```http
GET /api/auth/user
```
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "user": {
    "uid": "user-id",
    "email": "user@example.com",
    "emailVerified": true
  }
}
```

---

#### Get All Notes
```http
GET /api/notes
```
Get all notes for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "count": 2,
  "notes": [
    {
      "id": "note-id-1",
      "userId": "user-id",
      "title": "My First Note",
      "description": "Note description",
      "createdAt": "2025-10-20T10:00:00.000Z",
      "updatedAt": "2025-10-20T10:00:00.000Z"
    }
  ]
}
```

---

#### Get Single Note
```http
GET /api/notes/:id
```
Get a specific note by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "note": {
    "id": "note-id",
    "userId": "user-id",
    "title": "My Note",
    "description": "Note description",
    "createdAt": "2025-10-20T10:00:00.000Z",
    "updatedAt": "2025-10-20T10:00:00.000Z"
  }
}
```

---

#### Create Note
```http
POST /api/notes
```
Create a new note.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "My New Note",
  "description": "This is the note content"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Note created successfully",
  "note": {
    "id": "new-note-id",
    "userId": "user-id",
    "title": "My New Note",
    "description": "This is the note content",
    "createdAt": "2025-10-20T10:00:00.000Z",
    "updatedAt": "2025-10-20T10:00:00.000Z"
  }
}
```

---

#### Update Note
```http
PUT /api/notes/:id
```
Update an existing note.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Note updated successfully",
  "note": {
    "id": "note-id",
    "userId": "user-id",
    "title": "Updated Title",
    "description": "Updated description",
    "createdAt": "2025-10-20T10:00:00.000Z",
    "updatedAt": "2025-10-20T11:00:00.000Z"
  }
}
```

---

#### Delete Note
```http
DELETE /api/notes/:id
```
Delete a note.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Note deleted successfully"
}
```

---

### Error Responses

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (access denied)
- `404` - Not Found
- `500` - Internal Server Error

## 🗂️ Project Structure

```
backend/
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   └── notes.js             # Notes CRUD routes
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore file
├── Dockerfile              # Docker configuration
├── package.json            # Dependencies and scripts
├── README.md               # This file
└── server.js               # Main application file
```

## 🔒 Security

- **Helmet.js**: Sets security headers
- **CORS**: Configured to accept requests from frontend only
- **Token Verification**: All protected routes verify Firebase ID tokens
- **User Authorization**: Users can only access their own notes
- **Input Validation**: Express-validator for request validation

## 🧪 Testing the API

You can test the API using tools like:
- Postman
- Thunder Client (VS Code extension)
- curl
- Your frontend application

### Example curl request:
```bash
curl -X GET http://localhost:5000/api/notes \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

## 🐛 Troubleshooting

### Port already in use
Change the PORT in `.env` file:
```env
PORT=5001
```

### Firebase initialization error
- Verify `serviceAccountKey.json` exists in the backend directory
- Check that the path in `.env` is correct
- Ensure all Firebase environment variables are set

### CORS errors
- Verify `FRONTEND_URL` in `.env` matches your frontend URL
- Check that the frontend is running on the specified port

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Path to service account key | `./serviceAccountKey.json` |
| `FIREBASE_PROJECT_ID` | Firebase project ID | `your-project-id` |
| `FIREBASE_DATABASE_URL` | Firebase database URL | `https://your-project-id.firebaseio.com` |

## 📄 License

This project is part of a cloud application coursework.
