import { prisma } from "$lib/modules/database/prisma";

/** @type {import('./__types/[id]').RequestHandler} */
export async function get({ params }: { params: { id: string; }; }) {
    let id = params.id;

    const post = await prisma.post.findUnique({
        where: {
            pid: id,
        },
    });

    if (post) {
        return {
            body: {
                post,
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
