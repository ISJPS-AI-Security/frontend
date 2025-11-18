// utils/firebaseAuth.js
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export async function loginUser(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const token = await result.user.getIdToken();
  localStorage.setItem("token", token);
  localStorage.setItem("email", result.user.email || "");
  return result.user;
}

export async function logoutUser() {
  await signOut(auth);
  localStorage.removeItem("token");
  localStorage.removeItem("email");
}

export async function getToken() {
  return localStorage.getItem("token");
}

export { auth };
