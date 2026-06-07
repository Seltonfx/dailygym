import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";

import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKVd-RsbsABw6AH5YbUVpXjS4qCR3zyMY",
  authDomain: "daily-gym-5f01b.firebaseapp.com",
  projectId: "daily-gym-5f01b",
  storageBucket: "daily-gym-5f01b.firebasestorage.app",
  messagingSenderId: "674659596381",
  appId: "1:674659596381:web:28244208f084d657e8b5b4",
};

const app = initializeApp(firebaseConfig);

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, db };

