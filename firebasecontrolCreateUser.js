

import { getFirestore, collection, addDoc, doc, setDoc, getDoc, query, where, onSnapshot, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  REACT_NATIVE_FIREBASE_CONTROL_API_KEY, 
  REACT_NATIVE_FIREBASE_CONTROL_AUTH_DOMAIN,
  REACT_NATIVE_FIREBASE_CONTROL_AUTH_URL, 
  REACT_NATIVE_FIREBASE_CONTROL_PROJECT_ID, 
  REACT_NATIVE_FIREBASE_CONTROL_STORAGE_BUCKET, 
  REACT_NATIVE_FIREBASE_CONTROL_MESSAGING_SENDER_ID, 
  REACT_NATIVE_FIREBASE_CONTROL_APP_ID,
  REACT_NATIVE_FIREBASE_CONTROL_MEASUREMENT_ID } from '@env';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseControlCreateUserConfig = {
  apiKey:REACT_NATIVE_FIREBASE_CONTROL_API_KEY,
  authDomain:REACT_NATIVE_FIREBASE_CONTROL_AUTH_DOMAIN,
  databaseURL:REACT_NATIVE_FIREBASE_CONTROL_AUTH_URL,
  projectId:REACT_NATIVE_FIREBASE_CONTROL_PROJECT_ID,
  storageBucket:REACT_NATIVE_FIREBASE_CONTROL_STORAGE_BUCKET,
  messagingSenderId:REACT_NATIVE_FIREBASE_CONTROL_MESSAGING_SENDER_ID,
  appId:REACT_NATIVE_FIREBASE_CONTROL_APP_ID,
  measurementId:REACT_NATIVE_FIREBASE_CONTROL_MEASUREMENT_ID,
  };

// Initialize Firebase


require('firebase/auth');
// export const auth = app.auth()
const firebaseAppForCreateUser = initializeApp(firebaseControlCreateUserConfig, 'Secondary' );
const authForCreateUser = getAuth(firebaseAppForCreateUser);
// export default app
export {authForCreateUser};