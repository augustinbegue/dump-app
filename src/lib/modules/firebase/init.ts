import { getApps, initializeApp } from "firebase-admin/app";

if (!getApps().length) {
    // TODO: Add firebase project admin credentials here
    initializeApp({});
}