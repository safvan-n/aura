import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// Check if valid Firebase configuration is provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes("your_api_key")
);

let app = null;
let auth = null;
let db = null;
let storage = null;
let analytics = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();

    // Initialize Analytics if supported in the current environment
    if (typeof window !== "undefined") {
      isSupported().then((supported) => {
        if (supported && firebaseConfig.measurementId) {
          analytics = getAnalytics(app);
          console.log("[Firebase] Analytics initialized.");
        }
      }).catch(() => {});
    }

    console.log(
      "%c[Firebase] Successfully connected to project: " + firebaseConfig.projectId,
      "color: #10b981; font-weight: bold; font-size: 13px;"
    );
  } catch (error) {
    console.warn("[Firebase] Initialization error:", error);
  }
} else {
  console.info(
    "%c[Firebase] Running in Local Demo Mode. Configure .env with Firebase credentials.",
    "color: #6366f1; font-weight: bold;"
  );
}

export { app, auth, db, storage, analytics, googleProvider, firebaseConfig };
