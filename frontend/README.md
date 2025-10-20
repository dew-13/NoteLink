# NoteLink Frontend

Modern React-based frontend for NoteLink - A cloud-based note-taking application with Firebase authentication and Tailwind CSS styling.

## 🚀 Features

- **User Authentication**: Email/Password and Google Sign-In via Firebase
- **Note Management**: Create, read, update, and delete notes
- **Search Functionality**: Real-time note search
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Clean and intuitive user interface
- **Protected Routes**: Secure dashboard access
- **Real-time Updates**: Instant synchronization with backend

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project configured
- Backend API running

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     copy .env.example .env
     ```
   
   - Fill in your Firebase configuration in `.env`:
     ```env
     VITE_FIREBASE_API_KEY=your-api-key
     VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     VITE_FIREBASE_APP_ID=your-app-id
     VITE_API_URL=http://localhost:5000/api
     ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/                  # Static files
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── NoteCard.jsx     # Note display card
│   │   ├── NoteModal.jsx    # Create/Edit note modal
│   │   └── PrivateRoute.jsx # Protected route wrapper
│   ├── config/
│   │   └── firebase.js      # Firebase configuration
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication context
│   ├── pages/
│   │   ├── Dashboard.jsx    # Main dashboard page
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   └── NotFound.jsx     # 404 page
│   ├── services/
│   │   ├── api.js           # Axios configuration
│   │   └── noteService.js   # Note API calls
│   ├── App.jsx              # Main app component
│   ├── index.css            # Global styles with Tailwind
│   └── main.jsx             # Application entry point
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore file
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## 🎨 Key Components

### Authentication
- **Login Page**: Email/password and Google Sign-In
- **Register Page**: New user registration
- **AuthContext**: Global authentication state management
- **PrivateRoute**: Route protection for authenticated users

### Dashboard
- **Note Grid**: Displays all user notes in a responsive grid
- **Search Bar**: Filter notes by title or description
- **Create Note**: Modal for creating new notes
- **Edit Note**: Modal for updating existing notes
- **Delete Note**: Confirmation before deletion

### UI Components
- **Navbar**: Navigation with user info and logout
- **NoteCard**: Individual note display with hover effects
- **NoteModal**: Reusable modal for create/edit operations

## 🔐 Authentication Flow

1. User registers or logs in with email/password or Google
2. Firebase returns an ID token
3. Token is automatically attached to all API requests
4. Backend verifies token and authorizes requests
5. User can access protected routes (Dashboard)

## 🎨 Styling

The application uses **Tailwind CSS** for styling with custom utility classes:

### Custom Button Classes
- `.btn-primary` - Primary action button (blue)
- `.btn-secondary` - Secondary action button (gray)
- `.btn-danger` - Destructive action button (red)

### Custom Input Classes
- `.input-field` - Styled form input with focus effects

### Custom Card Classes
- `.card` - White card with shadow and hover effects

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

## 🔧 Configuration Files

### vite.config.js
- Configures Vite development server
- Sets port to 3000
- Enables React Fast Refresh

### tailwind.config.js
- Extends Tailwind with custom colors (primary palette)
- Configures content paths for purging

### postcss.config.js
- Enables Tailwind CSS and Autoprefixer

## 📡 API Integration

The frontend communicates with the backend API using Axios with:
- **Automatic token injection**: Adds Firebase token to all requests
- **Error handling**: Intercepts and handles API errors
- **Base URL configuration**: Set via environment variable

## 🧪 Testing

You can test the application by:
1. Starting the backend server
2. Starting the frontend development server
3. Registering a new user
4. Creating, editing, and deleting notes
5. Testing search functionality
6. Logging out and logging back in

## 🐛 Troubleshooting

### Firebase configuration errors
- Verify all `VITE_FIREBASE_*` variables in `.env`
- Check Firebase Console for correct values
- Ensure Firebase Authentication is enabled

### API connection errors
- Verify backend is running on correct port
- Check `VITE_API_URL` in `.env`
- Verify CORS settings in backend

### Build errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check for CSS lint errors (Tailwind directives are expected)

### Authentication errors
- Check Firebase Console > Authentication > Sign-in methods
- Verify Email/Password and Google providers are enabled
- Check authorized domains in Firebase settings

## 📦 Dependencies

### Core Dependencies
- **react** & **react-dom**: UI framework
- **react-router-dom**: Routing
- **firebase**: Authentication and SDK
- **axios**: HTTP client
- **react-icons**: Icon library

### Dev Dependencies
- **vite**: Build tool and dev server
- **tailwindcss**: Utility-first CSS framework
- **autoprefixer**: CSS post-processor
- **postcss**: CSS transformation tool

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | `AIza...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | `1:123:web:abc` |
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## 🚀 Deployment

When deploying to production:
1. Update `VITE_API_URL` to your production backend URL
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your hosting service
4. Add your production domain to Firebase authorized domains

## 📄 License

This project is part of a cloud application coursework.
