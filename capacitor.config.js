// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArlj7YhvyB5EZM5DhD8fKJICpT2x4nrwk",
  authDomain: "fit-streak-ai.firebaseapp.com",
  projectId: "fit-streak-ai",
  storageBucket: "fit-streak-ai.firebasestorage.app",
  messagingSenderId: "244306740674",
  appId: "1:244306740674:web:2486c811127f351ba8825b",
  measurementId: "G-XF8PY9DN6Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);