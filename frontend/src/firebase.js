import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqbI-IZwXL1qT5DBWneMF2cuWOmyZ35is",
  authDomain: "expense-manager-4d508.firebaseapp.com",
  projectId: "expense-manager-4d508",
  storageBucket: "expense-manager-4d508.firebasestorage.app",
  messagingSenderId: "384285666286"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
