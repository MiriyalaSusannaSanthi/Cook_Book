import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAzrt-itGKKF8BgtHCtTgoNxnlfbCpvZPU",
  authDomain: "smartchef-ae147.firebaseapp.com",
  projectId: "smartchef-ae147",
  storageBucket: "smartchef-ae147.firebasestorage.app",
  messagingSenderId: "502545628433",
  appId: "1:502545628433:web:d7721ab82beb110e8860b0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();