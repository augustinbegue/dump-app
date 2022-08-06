import { credential } from "firebase-admin";
import { getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getStorage, Storage } from "firebase-admin/storage";
import serviceAccount from "./dump-app-dev-firebase-adminsdk.json";

export let app: App;
export let auth: Auth;
export let storage: Storage;

if (!getApps().length) {
    app = initializeApp({
        credential: credential.cert(serviceAccount as ServiceAccount),
        storageBucket: "dump-app-dev.appspot.com"
    });

    auth = getAuth(app);
    storage = getStorage(app);
}