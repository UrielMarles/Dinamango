import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvr3PlVmd_4_9FaZm4Mnm7-Xvis00mVeU",
  authDomain: "dinamangodev.firebaseapp.com",
  projectId: "dinamangodev",
  storageBucket: "dinamangodev.appspot.com",
  messagingSenderId: "1051807482570",
  appId: "1:1051807482570:web:e43051943a757daa8eea33",
  measurementId: "G-CDLWGR8J5R",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export { auth };
