import { prisma } from "$lib/modules/database/prisma";
import type { RequestEvent } from "@sveltejs/kit";

export async function get({ params, locals }: RequestEvent) {
    if (!locals.user) {
        return {
            status: 401,
            body: {
                message: "Unauthorized",
            },
        };
    }

    let { uid } = locals.user;

    const user = await prisma.user.findUnique({
        where: {
            uid: uid,
        },
    });


    if (user) {
        return {
            body: {
                user,
            }
        };
    }

    return {
        status: 404,
        body: {
            message: "User not found",
        }
    };
}
