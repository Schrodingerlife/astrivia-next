import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD-vixTXjX6_mXgH6PpP7mJQbP4QqBtyIs",
    authDomain: "astrivia-website.firebaseapp.com",
    projectId: "astrivia-website",
    storageBucket: "astrivia-website.firebasestorage.app",
    messagingSenderId: "1024609903368",
    appId: "1:1024609903368:web:d85e48e11d16eccf5e02bd"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Email autorizado para acessar o admin
export const ADMIN_EMAILS = ["nicollas@astrivia.ai", "nicollas.braga@usp.br", "nicollas.braga@gmail.com"];

export { app, auth, db, googleProvider };
