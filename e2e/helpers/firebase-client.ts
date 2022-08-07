import { initializeApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, type User as FbUser } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCaS20d8AgpxidNfKQEzAi4NUWB0Bp1QKU",
    authDomain: "dump-app-dev.firebaseapp.com",
    projectId: "dump-app-dev",
    storageBucket: "dump-app-dev.appspot.com",
    messagingSenderId: "244773079310",
    appId: "1:244773079310:web:868a0130441f1701dcaf5f",
    measurementId: "G-M6CRBM5WDK"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);