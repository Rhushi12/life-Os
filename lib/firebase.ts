import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBveSl3pjUQ_yVnaEwH7Za67nzJIilItoM",
    authDomain: "life-os-81a02.firebaseapp.com",
    projectId: "life-os-81a02",
    storageBucket: "life-os-81a02.firebasestorage.app",
    messagingSenderId: "566964924472",
    appId: "1:566964924472:web:5a2aa92aabe6cf3fc6f6cd",
    measurementId: "G-PBSLVE3QWH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Add scopes for Gmail
googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
// Add other scopes as needed
