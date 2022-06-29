import { credential } from "firebase-admin";
import { getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import serviceAccount from "./dump-app-dev-firebase-adminsdk.json";

export let app: App;

if (!getApps().length) {
    app = initializeApp({
        credential: credential.cert(serviceAccount as ServiceAccount),
    });
}