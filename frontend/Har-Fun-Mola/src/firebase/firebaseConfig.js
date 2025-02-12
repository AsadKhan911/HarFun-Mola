import { initializeApp, getApps } from 'firebase/app';  // Import getApps to check existing apps
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCs2Mvn_R2-tU0F6sAiO0JSylozVBzn6Js",
  authDomain: "harfunmola-b840e.firebaseapp.com",
  projectId: "harfunmola-b840e",
  databaseURL: "https://harfunmola-b840e-default-rtdb.asia-southeast1.firebasedatabase.app/",  // Updated URL
  storageBucket: "harfunmola-b840e.firebasestorage.app",  
  messagingSenderId: "990911184892",
  appId: "1:990911184892:web:617a391f45c6c0ae7cfc79"
};

// Initialize Firebase only if it hasn't been initialized yet
let app;

if (getApps().length === 0) {
  // No Firebase apps are initialized yet, so initialize one
  app = initializeApp(firebaseConfig);
} else {
  // Firebase app is already initialized, use the default app
  app = getApps()[0];
}

const db = getDatabase(app);

// Export auth and db
export const auth = getAuth(app);
export { db };
