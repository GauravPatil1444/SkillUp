import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5gleB55IOM7KylIeKnNXmhKakesIGzrU",
  authDomain: "skillup-ai1444.firebaseapp.com",
  projectId: "skillup-ai1444",
  storageBucket: "skillup-ai1444.appspot.com",
  messagingSenderId: "505952169629",
  appId: "1:505952169629:web:0d19b3b4c6589f7fe66e74",
  measurementId: "G-QZBM9RBXJT"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
