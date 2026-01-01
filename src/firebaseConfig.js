import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// REPLACE THESE PLACEHOLDERS WITH YOUR ACTUAL CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyAfYcHHSK_k_jSU78upVDVJ8Zb6xIL9s6U",
  authDomain: "donation-zakat-system-19df2.firebaseapp.com",
  projectId: "donation-zakat-system-19df2",
  // Typical storage bucket format is "<project-id>.appspot.com"
  storageBucket: "donation-zakat-system-19df2.appspot.com",
  messagingSenderId: "157962157914",
  appId: "1:157962157914:web:2aa2f39b3584bd9fd2bd63",
  measurementId: "G-VLCZVVXS34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
