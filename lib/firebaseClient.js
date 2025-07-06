// lib/firebaseClient.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCuytfxoyHhYOLVzYpeyOftlfnC0pMzTO8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "location-ecca4.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "location-ecca4",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "location-ecca4.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "935936028433",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:935936028433:web:40ebefaf6cd4c335d526b0",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-EPDZV6EGS4",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { db, rtdb }; 