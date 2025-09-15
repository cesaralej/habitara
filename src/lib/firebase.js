// src/lib/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Import Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Import Firestore if you need it here
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// Get this from your Firebase Project settings -> "Your apps" -> Web app setup
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_HABITARA_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_HABITARA_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_HABITARA_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_HABITARA_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_HABITARA_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_HABITARA_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_HABITARA_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app); // Get the Auth instance
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app); // Get the Firestore instance
