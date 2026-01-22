// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
//     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//     appId: "YOUR_APP_ID"
// };

// let app;
// let db = null;

// try {
//     // Check if we are using the placeholder or if config is missing
//     if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY") {
//         console.warn("Firebase Configuration is missing or using placeholders. Firebase integration will be disabled.");
//         // db remains null
//     } else {
//         app = initializeApp(firebaseConfig);
//         db = getFirestore(app);
//         console.log("Firebase initialized successfully.");
//     }
// } catch (error) {
//     console.error("Firebase Initialization Failed:", error);
//     // db remains null
// }

// export { db };



import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Replace these placeholders with your actual Firebase project settings
// You can find these in your Firebase Console -> Project Settings
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;