import { initializeApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, type User } from "firebase/auth";
import { browser } from "$app/env";
import { writable } from "svelte/store";

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
export let analytics: Analytics;
if (browser) {
    analytics = getAnalytics(app);
}

export const userStore = writable<User | null>(null);
export const auth = getAuth(app);
auth.onAuthStateChanged(user => {
    userStore.set(user);
});
export const googleProvider = new GoogleAuthProvider();