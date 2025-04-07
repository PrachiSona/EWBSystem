// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, getIdToken } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPGdRn-xyEskGsYbKguOX7lAk7ASnIDww",
  authDomain: "ewaybillsystem-b6ef2.firebaseapp.com",
  projectId: "ewaybillsystem-b6ef2",
  storageBucket: "ewaybillsystem-b6ef2.firebasestorage.app",
  messagingSenderId: "90048481929",
  appId: "1:90048481929:web:42cd950ad4b84dbd4e1458",
  measurementId: "G-ZSTB7D7G4B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, getIdToken };
