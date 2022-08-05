import { credential } from "firebase-admin";
import { getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import serviceAccount from "./dump-app-dev-firebase-adminsdk.json";

export let app: App;
export let auth: Auth;

if (!getApps().length) {
    app = initializeApp({
        credential: credential.cert(serviceAccount as ServiceAccount),
    });

    auth = getAuth(app);
}