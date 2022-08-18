import type { AlertMessage } from "$lib/types/api";
import { writable } from "svelte/store";

export const alerts = writable<AlertMessage[]>([]);

export function addAlert(message: AlertMessage) {
    alerts.update(arr => [...arr, message]);
}