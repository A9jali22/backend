// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtMPw-GBAmbsOIshjFX74oBdJ3glKGbis",
  authDomain: "worktrace-96e0c.firebaseapp.com",
  projectId: "worktrace-96e0c",
  storageBucket: "worktrace-96e0c.firebasestorage.app",
  messagingSenderId: "975860193270",
  appId: "1:975860193270:web:abeb9c97de1f75410799d7",
  measurementId: "G-0SBVKQ6QW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db, signInWithEmailAndPassword, signOut };