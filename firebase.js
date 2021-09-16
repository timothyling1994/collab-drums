import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "667986157636",
  appId: "1:667986157636:web:f0f415680df88c61785c11",
  measurementId: "G-G2SF3BXKT6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);


export default app;

