import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBaIqGOaSoUb81Mlwo6b650hA7_PVZI03k",
  authDomain: "future-fits.firebaseapp.com",
  projectId: "future-fits",
  storageBucket: "future-fits.firebasestorage.app",
  messagingSenderId: "1036146607408",
  appId: "1:1036146607408:web:040f83dcd0e35f4fd5b4f5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);