// lib/firebaseClient.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCuytfxoyHhYOLVzYpeyOftlfnC0pMzTO8",
  authDomain: "location-ecca4.firebaseapp.com",
  projectId: "location-ecca4",
  storageBucket: "location-ecca4.firebasestorage.app",
  messagingSenderId: "935936028433",
  appId: "1:935936028433:web:40ebefaf6cd4c335d526b0",
  measurementId: "G-EPDZV6EGS4",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { db, rtdb }; 