"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA0s9vHEkDR0lWEXIsI8TvcHHjX9TQ5xXk",
  authDomain: "connectchat-d3713.firebaseapp.com",
  databaseURL: "https://connectchat-d3713-default-rtdb.firebaseio.com",
  projectId: "connectchat-d3713",
  storageBucket: "connectchat-d3713.firebasestorage.app",
  messagingSenderId: "393420495514",
  appId: "1:393420495514:web:4ff7e73efe3d68172f5d23"
};

// Initialize Firebase only once
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Auth exports
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Database exports
export const db = getDatabase(app);

// Storage exports
export const storage = getStorage(app);

export default app;
