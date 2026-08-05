import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// These come from your .env file (see .env.example) — never commit real
// values to a public repo's committed .env; Vite only exposes vars
// prefixed with VITE_ to the browser bundle, which is expected for a
// client-side Firebase config (it is not a secret key, but keep your
// database rules locked down regardless — see README.md).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
