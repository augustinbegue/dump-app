import { prisma } from "$lib/modules/database/prisma";

/** @type {import('./__types/[uid]').RequestHandler} */


export async function get({ params }: { params: { username: string; }; }) {
    let username = params.username;

    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });

    if (user) {
        return {
            status: 200,
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
