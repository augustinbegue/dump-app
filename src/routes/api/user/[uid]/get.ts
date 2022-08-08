import { prisma } from "$lib/modules/database/prisma";

/** @type {import('./__types/[uid]').RequestHandler} */
export async function GET({ params }: { params: { uid: string; }; }) {
    let uid = params.uid;

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
