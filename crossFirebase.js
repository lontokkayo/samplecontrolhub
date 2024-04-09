import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import {
  REACT_NATIVE_FIREBASE_CONTROL_API_KEY,
  REACT_NATIVE_FIREBASE_CONTROL_AUTH_DOMAIN,
  REACT_NATIVE_FIREBASE_CONTROL_AUTH_URL,
  REACT_NATIVE_FIREBASE_CONTROL_PROJECT_ID,
  REACT_NATIVE_FIREBASE_CONTROL_STORAGE_BUCKET,
  REACT_NATIVE_FIREBASE_CONTROL_MESSAGING_SENDER_ID,
  REACT_NATIVE_FIREBASE_CONTROL_APP_ID,
  REACT_NATIVE_FIREBASE_CONTROL_MEASUREMENT_ID
} from '@env';

import {
  REACT_NATIVE_FIREBASE_EXTENSION_API_KEY,
  REACT_NATIVE_FIREBASE_EXTENSION_AUTH_DOMAIN,
  REACT_NATIVE_FIREBASE_EXTENSION_PROJECT_ID,
  REACT_NATIVE_FIREBASE_EXTENSION_STORAGE_BUCKET,
  REACT_NATIVE_FIREBASE_EXTENSION_MESSAGING_SENDER_ID,
  REACT_NATIVE_FIREBASE_EXTENSION_APP_ID,
  REACT_NATIVE_FIREBASE_EXTENSION_MEASUREMENT_ID
} from '@env';

// Configuration for Firebase project 1
const firebaseConfigControl = {
  apiKey: REACT_NATIVE_FIREBASE_CONTROL_API_KEY,
  authDomain: REACT_NATIVE_FIREBASE_CONTROL_AUTH_DOMAIN,
  databaseURL: REACT_NATIVE_FIREBASE_CONTROL_AUTH_URL,
  projectId: REACT_NATIVE_FIREBASE_CONTROL_PROJECT_ID,
  storageBucket: REACT_NATIVE_FIREBASE_CONTROL_STORAGE_BUCKET,
  messagingSenderId: REACT_NATIVE_FIREBASE_CONTROL_MESSAGING_SENDER_ID,
  appId: REACT_NATIVE_FIREBASE_CONTROL_APP_ID,
  measurementId: REACT_NATIVE_FIREBASE_CONTROL_MEASUREMENT_ID,
};

// Configuration for Firebase project 2
const firebaseConfigExtension = {
  // Replace with your project 2 configuration
  apiKey: REACT_NATIVE_FIREBASE_EXTENSION_API_KEY,
  authDomain: REACT_NATIVE_FIREBASE_EXTENSION_AUTH_DOMAIN,
  projectId: REACT_NATIVE_FIREBASE_EXTENSION_PROJECT_ID,
  storageBucket: REACT_NATIVE_FIREBASE_EXTENSION_STORAGE_BUCKET,
  messagingSenderId: REACT_NATIVE_FIREBASE_EXTENSION_MESSAGING_SENDER_ID,
  appId: REACT_NATIVE_FIREBASE_EXTENSION_APP_ID,
  measurementId: REACT_NATIVE_FIREBASE_EXTENSION_MEASUREMENT_ID,

};

// Initialize Firebase for project 1
export const projectControlFirebase = initializeApp(firebaseConfigControl);
export const projectControlAuth = getAuth(projectControlFirebase);
export const projectControlFirestore = getFirestore(projectControlFirebase);

// Initialize Firebase for project 2
export const projectExtensionFirebase = initializeApp(firebaseConfigExtension, 'projectExtension');
export const projectExtensionAuth = getAuth(projectExtensionFirebase);
export const projectExtensionFirestore = getFirestore(projectExtensionFirebase);
