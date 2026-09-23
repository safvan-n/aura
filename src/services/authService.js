import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "./firebase";

// Fallback demo users stored in localStorage when Firebase is not configured
const STORAGE_USER_KEY = "aura_current_user";

export const authService = {
  // Sign in with email and password
  async login(email, password) {
    if (isFirebaseConfigured && auth) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || email.split("@")[0],
        role: email.includes("admin") ? "admin" : "customer"
      };
    } else {
      // Local demo mode
      const user = {
        uid: "demo-" + Math.random().toString(36).substring(2, 9),
        email,
        displayName: email.split("@")[0],
        role: email.toLowerCase().includes("admin") ? "admin" : "customer"
      };
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      return user;
    }
  },

  // Register new user
  async register(email, password, displayName) {
    if (isFirebaseConfigured && auth) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName || email.split("@")[0],
        role: email.includes("admin") ? "admin" : "customer"
      };
    } else {
      // Local demo mode
      const user = {
        uid: "demo-" + Math.random().toString(36).substring(2, 9),
        email,
        displayName: displayName || email.split("@")[0],
        role: email.toLowerCase().includes("admin") ? "admin" : "customer"
      };
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      return user;
    }
  },

  // Sign in with Google Popup
  async loginWithGoogle() {
    if (isFirebaseConfigured && auth && googleProvider) {
      const result = await signInWithPopup(auth, googleProvider);
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        role: result.user.email?.includes("admin") ? "admin" : "customer"
      };
    } else {
      const user = {
        uid: "demo-google-user",
        email: "alex.mercer@gmail.com",
        displayName: "Alex Mercer",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        role: "customer"
      };
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      return user;
    }
  },

  // Sign out
  async logout() {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    localStorage.removeItem(STORAGE_USER_KEY);
    return true;
  },

  // Listen to auth state changes
  subscribeToAuth(callback) {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          callback({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
            photoURL: firebaseUser.photoURL,
            role: firebaseUser.email?.includes("admin") ? "admin" : "customer"
          });
        } else {
          callback(null);
        }
      });
    } else {
      // Check localStorage for demo session
      const savedUser = localStorage.getItem(STORAGE_USER_KEY);
      if (savedUser) {
        try {
          callback(JSON.parse(savedUser));
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
      return () => {};
    }
  },

  // Get current stored demo user
  getCurrentUser() {
    if (isFirebaseConfigured && auth?.currentUser) {
      const u = auth.currentUser;
      return {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName || u.email?.split("@")[0],
        photoURL: u.photoURL,
        role: u.email?.includes("admin") ? "admin" : "customer"
      };
    }
    const saved = localStorage.getItem(STORAGE_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  }
};
