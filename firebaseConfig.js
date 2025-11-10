// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeCbbcaKd0dKY8V_l5K2y6Kg8M0Q-sWV0",
  authDomain: "flyts-admin-app.firebaseapp.com",
  projectId: "flyts-admin-app",
  storageBucket: "flyts-admin-app.firebasestorage.app",
  messagingSenderId: "111558252051",
  appId: "1:111558252051:web:93f509de18cfa22aa551e6",
  measurementId: "G-SLP9KEYMG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);