const admin = require('firebase-admin');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from the parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Initialize Firebase Admin SDK with absolute path
const serviceAccountPath = path.join(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Get Firestore database instance
const db = admin.firestore();

module.exports = { admin, db };
