import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLVSp2rdrR77iDLErEjLeJEpXlKMR5BFI",
  authDomain: "artivity-indonesia-2705.firebaseapp.com",
  projectId: "artivity-indonesia-2705",
  storageBucket: "artivity-indonesia-2705.firebasestorage.app",
  messagingSenderId: "605204145950",
  appId: "1:605204145950:web:66ef0c1cbebce54998cb0f",
  measurementId: "G-X9T59N9LF6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);