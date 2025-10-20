# NoteLink - Cloud-Based Note Taking Application

A full-stack cloud application for taking and managing personal notes with secure authentication, built with React, Node.js, and Firebase.

## 📖 Project Overview

**NoteLink** is a modern, cloud-based note-taking application that allows users to create, view, edit, and delete personal notes with secure authentication. The application features a clean, responsive UI and stores all notes in Firebase Firestore for cross-device accessibility.

### Key Features

✅ **Secure Authentication**
- Email/Password registration and login
- Google Sign-In integration
- Firebase Authentication

✅ **Note Management**
- Create notes with title and description
- View all notes in a responsive grid layout
- Edit existing notes
- Delete notes with confirmation
- Real-time search functionality

✅ **Cloud Storage**
- All notes stored in Firebase Firestore
- Access notes from any device
- Automatic synchronization

✅ **Modern UI/UX**
- Clean and intuitive interface
- Responsive design (mobile, tablet, desktop)
- Built with React and Tailwind CSS
- Smooth animations and transitions

✅ **Security**
- JWT token-based authentication
- Protected API endpoints
- User-specific note access
- Firebase security rules

## 🏗️ Architecture

This project follows a **separated frontend and backend architecture** designed for deployment in different cloud containers:

```
┌─────────────────┐         HTTP/HTTPS        ┌─────────────────┐
│                 │   ───────────────────>    │                 │
│  React Frontend │                           │  Node.js API    │
│  (Port 3000)    │   <───────────────────    │  (Port 5000)    │
│                 │      JSON Response         │                 │
└─────────────────┘                           └─────────────────┘
        │                                              │
        │                                              │
        │ Firebase Auth                                │ Firebase Admin
        │ (Client SDK)                                 │ (Server SDK)
        │                                              │
        ▼                                              ▼
┌──────────────────────────────────────────────────────────────┐
│                     Firebase Services                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Authentication│  │  Firestore   │  │   Storage    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Firebase SDK** - Authentication
- **React Icons** - Icon library

#### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Firebase Admin SDK** - Server-side Firebase
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Request validation

#### Cloud Services
- **Firebase Authentication** - User management
- **Cloud Firestore** - NoSQL database
- **Firebase Hosting** (optional) - Static hosting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **Firebase account** (free tier is sufficient)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NoteLink
```

### 2. Firebase Setup

Follow the comprehensive [Firebase Setup Guide](FIREBASE_SETUP.md) to:
1. Create a Firebase project
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore database
4. Configure security rules
5. Get your Firebase configuration credentials

### 3. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```bash
copy .env.example .env
```

Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

Add Firebase service account key:
- Download `serviceAccountKey.json` from Firebase Console
- Place it in the `backend` directory

Start the backend server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```bash
copy .env.example .env
```

Configure environment variables in `.env`:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📚 Documentation

- **[Backend README](backend/README.md)** - Backend API documentation
- **[Frontend README](frontend/README.md)** - Frontend documentation
- **[Firebase Setup Guide](FIREBASE_SETUP.md)** - Complete Firebase configuration

## 🗂️ Project Structure

```
NoteLink/
├── backend/                    # Node.js backend API
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   └── notes.js           # Note CRUD endpoints
│   ├── .env.example           # Environment template
│   ├── package.json
│   ├── README.md
│   └── server.js              # Main server file
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React context
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── config/            # Firebase config
│   │   └── App.jsx
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   └── index.html
│
├── FIREBASE_SETUP.md          # Firebase configuration guide
└── README.md                  # This file
```

## 🔒 Security Features

1. **Authentication**: Firebase Authentication with email/password and Google OAuth
2. **Authorization**: JWT token verification on all protected endpoints
3. **Data Access Control**: Users can only access their own notes
4. **Firestore Security Rules**: Database-level security
5. **Security Headers**: Helmet.js for HTTP security headers
6. **CORS Protection**: Configured to accept requests from frontend only
7. **Input Validation**: Express-validator for request validation
8. **Environment Variables**: Sensitive data stored in .env files

## 📱 Functional Requirements Implementation

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| User Registration/Login | ✅ | Firebase Auth with Email/Password |
| Google Sign-In | ✅ | Firebase OAuth integration |
| Create Note | ✅ | POST /api/notes endpoint |
| View Notes | ✅ | Dashboard with grid layout |
| Edit Note | ✅ | PUT /api/notes/:id endpoint |
| Delete Note | ✅ | DELETE /api/notes/:id endpoint |
| Search Notes | ✅ | Client-side search functionality |
| Logout | ✅ | Firebase signOut |

## 📊 Non-Functional Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Security** | Firebase Auth, JWT tokens, Security rules |
| **Scalability** | Cloud Firestore supports horizontal scaling |
| **Usability** | Clean UI with Tailwind CSS, intuitive navigation |
| **Reliability** | Cloud database with automatic backup |
| **Responsiveness** | Mobile-first design, works on all devices |
| **Performance** | Vite for fast builds, optimized React components |

## 🧪 Testing the Application

1. **Start both servers**:
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

2. **Test user registration**:
   - Navigate to `http://localhost:3000/register`
   - Create an account with email/password or Google

3. **Test note operations**:
   - Create a new note
   - Edit an existing note
   - Search for notes
   - Delete a note

4. **Test authentication**:
   - Logout
   - Try to access dashboard (should redirect to login)
   - Login again

## 🚢 Deployment Considerations

### Backend Deployment
- Deploy to cloud platforms: Heroku, AWS, Google Cloud Run, Azure
- Update `FRONTEND_URL` environment variable
- Ensure `serviceAccountKey.json` is securely stored
- Set `NODE_ENV=production`

### Frontend Deployment
- Update `VITE_API_URL` to production backend URL
- Build: `npm run build`
- Deploy `dist` folder to: Netlify, Vercel, Firebase Hosting, AWS S3
- Add production domain to Firebase authorized domains

### Firebase Configuration
- Review and tighten Firestore security rules
- Enable Firebase App Check
- Set up usage quotas and billing alerts
- Configure custom domain (optional)

## 🐛 Troubleshooting

### Common Issues

**"Port already in use"**
- Change PORT in backend `.env`
- Kill process using the port

**"Firebase not initialized"**
- Check all environment variables
- Verify Firebase credentials
- Ensure serviceAccountKey.json exists

**"CORS errors"**
- Verify FRONTEND_URL in backend .env
- Check browser console for specific error

**"Authentication failed"**
- Enable auth providers in Firebase Console
- Check authorized domains
- Verify Firebase configuration

See individual README files for more troubleshooting tips.

## 👨‍💻 Development Team

This project was developed as part of a Cloud Application Development course.

## 📄 License

This project is for educational purposes as part of coursework.

## 🙏 Acknowledgments

- Firebase for authentication and database services
- Tailwind CSS for the styling framework
- React and Vite communities for excellent tooling
- Course instructors for project guidance

## 📞 Support

For issues and questions:
1. Check the documentation in README files
2. Review the Firebase Setup Guide
3. Check backend and frontend logs
4. Verify all environment variables are set correctly

---

**Built with ❤️ using React, Node.js, and Firebase**
