// Firebase Strategic Identity Configuration
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// --- UPDATED FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyDcyt9JT_s9LRJsnnMJYp3IQQNfrOjPACg",
  authDomain: "wardfixed-eb40a.firebaseapp.com",
  projectId: "wardfixed-eb40a",
  storageBucket: "wardfixed-eb40a.firebasestorage.app",
  messagingSenderId: "96559035848",
  appId: "1:96559035848:web:be2d1bcef9b00b2ac1bcfd"
};

// Initialize Firebase Node
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const authenticateWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        return {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            uid: user.uid
        };
    } catch (e) {
        console.error("Firebase Handshake Protocol Failure:", e);
        throw e;
    }
};
