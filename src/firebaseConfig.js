import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// =============================================================
// Firebase konfiguratsiyasi (Firebase Console'dan olingan)
// =============================================================
const firebaseConfig = {
  apiKey: "AIzaSyAOxy3TDZzgsOnC85vFX6_bwe2wTlOvDm4",
  authDomain: "avtotek.firebaseapp.com",
  projectId: "avtotek",
  storageBucket: "avtotek.firebasestorage.app",
  messagingSenderId: "999825057167",
  appId: "1:999825057167:web:97ad67df72257796e617fa",
};

const app = initializeApp(firebaseConfig);

// Firestore ma'lumotlar bazasi — shu orqali o'qish/yozish qilamiz
export const db = getFirestore(app);
