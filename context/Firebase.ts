import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMoralisAuth } from "@moralisweb3/client-firebase-auth-utils";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "firebaseApiKey",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const moralisAuth = getMoralisAuth(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

export const vaultWallet = "0x51cB35800f8dcb2CF86f693f76665C21F04A0cFe";
