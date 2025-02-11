// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCs2Mvn_R2-tU0F6sAiO0JSylozVBzn6Js",
  authDomain: "harfunmola-b840e.firebaseapp.com",
  projectId: "harfunmola-b840e",
  storageBucket: "harfunmola-b840e.firebasestorage.app",  
  messagingSenderId: "990911184892",
  appId: "1:990911184892:web:617a391f45c6c0ae7cfc79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);