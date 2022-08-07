import { initializeApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, type User as FbUser } from "firebase/auth";
import { browser } from "$app/env";
import { writable } from "svelte/store";
import type { User } from "@prisma/client";

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

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const currentUser = writable<User | null>(null);
export const firebaseUser = writable<FbUser | null>(null);

auth.onAuthStateChanged(async user => {
    firebaseUser.set(user);

    if (user) {
        document.cookie = `authorization=Bearer ${await user.getIdToken()}; Path=/; Expires=Session;`;
        let res = await fetch(`/api/user/${user.uid}`);
        const dbUser = (await res.json()).user;
        currentUser.set(dbUser);
        console.log("user changed, resetting token", dbUser);
    } else {
        currentUser.set(null);
        console.log("no user, removing token");

        if (browser)
            document.cookie = "authorization=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    }
});
