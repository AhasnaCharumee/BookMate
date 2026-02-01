import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB9k5X7Y2gvTSyeKz8STfuSdPij0esbZnA",
  authDomain: "book-52c43.firebaseapp.com",
  projectId: "book-52c43",
  storageBucket: "book-52c43.appspot.com",
  messagingSenderId: "555256137272",
  appId: "1:555256137272:web:0fbf51b59eaa1bede148cd"
};

// Init app
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth - AsyncStorage persistence is handled by AuthContext
export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
