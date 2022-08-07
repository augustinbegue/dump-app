import admin from "firebase-admin";
import { getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getStorage, Storage } from "firebase-admin/storage";
import { readFileSync } from "fs";
import path from "path";
export let app: App;
export let auth: Auth;
export let storage: Storage;


if (!getApps().length) {
    const serviceAccount: ServiceAccount = JSON.parse(readFileSync(path.resolve(path.dirname("./dump-app-dev-firebase-adminsdk.json"), "e2e/helpers/dump-app-dev-firebase-adminsdk.json")).toString())
    app = initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount),
        storageBucket: "dump-app-dev.appspot.com"
    });

    auth = getAuth(app);
    storage = getStorage(app);
}