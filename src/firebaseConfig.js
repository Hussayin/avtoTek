import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase avtotek-v2 konfiguratsiyasi
const firebaseConfig = {
  apiKey: "AIzaSyBC-5cyQh72SBqf4gquzp6QGDkW5_nIXI0",
  authDomain: "avtotek-v2.firebaseapp.com",
  projectId: "avtotek-v2",
  storageBucket: "avtotek-v2.firebasestorage.app",
  messagingSenderId: "732322871794",
  appId: "1:732322871794:web:e7c3738ce0ef6615b6536b",
};

const app = initializeApp(firebaseConfig);

// Firestore ma'lumotlar bazasini eksport qilamiz
export const db = getFirestore(app);
