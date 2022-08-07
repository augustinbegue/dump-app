import { prisma } from "$lib/modules/database/prisma";
import { auth } from "$lib/modules/firebase/admin";
import type { RequestEvent } from "@sveltejs/kit";

export async function post({ request, locals }: RequestEvent) {
    if (!locals.user) {
        return {
            status: 401,
            body: {
                message: "Unauthorized",
            },
        };
    }

    const data = await request.json();

    let { uid } = locals.user;

    if (!data.username) {
        return {
            status: 400,
            body: {
                message: "Missing username",
            }
        };
    }

    if (!data.name) {
        return {
            status: 400,
            body: {
                message: "Missing name",
            }
        };
    }

    try {
        let fbUser = await auth.getUser(uid);

        if (!fbUser) {
            return {
                status: 400,
                body: {
                    message: "Missing/wrong uid",
                }
            };
        }

        const user = await prisma.user.upsert({
            where: {
                uid: uid,
            },
            update: {
                username: data.username,
                name: data.name,
            },
            create: {
                uid: uid,
                ...data,
            },
        });

        return {
            body: {
                user,
            },
        };
    } catch (error) {
        return {
            status: 400,
            body: {
                message: error,
            }
        };
    }
}