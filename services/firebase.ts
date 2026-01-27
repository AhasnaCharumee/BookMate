// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9k5X7Y2gvTSyeKz8STfuSdPij0esbZnA",
  authDomain: "book-52c43.firebaseapp.com",
  projectId: "book-52c43",
  storageBucket: "book-52c43.firebasestorage.app",
  messagingSenderId: "555256137272",
  appId: "1:555256137272:web:0fbf51b59eaa1bede148cd"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication with React Native persistence
let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // If already initialized (hot reload), fall back to existing instance
  authInstance = getAuth(app);
}

export const auth = authInstance;

export const db = getFirestore(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;