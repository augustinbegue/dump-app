import admin from "firebase-admin";
import { getApp, getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getStorage, Storage } from "firebase-admin/storage";

export let app: App;
export let auth: Auth;
export let storage: Storage;

import dotenv from 'dotenv';
dotenv.config();

if (!getApps().length) {
    app = initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.VITE_FIREBASE_ADMIN_PROJECT_ID,
            clientEmail: process.env.VITE_FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.VITE_FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
        storageBucket: "dump-app-dev.appspot.com"
    });
} else {
    app = getApp();
}

auth = getAuth(app);
storage = getStorage(app);