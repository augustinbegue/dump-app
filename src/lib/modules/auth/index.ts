import type { User } from "@prisma/client";
import type { User as FbUser } from "firebase/auth";
import { writable } from "svelte/store";
import { auth } from "../firebase/client";

export const firebaseUser = writable<FbUser | null>(null);

export const currentUser = writable<User | null>(null);

auth.onAuthStateChanged(async user => {
    firebaseUser.set(user);

    if (user) {
        let res = await fetch(`/api/user/${user.uid}`);
        currentUser.set((await res.json()).user);
    } else {
        currentUser.set(null);
    }
});
