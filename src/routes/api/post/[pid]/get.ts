import { prisma } from "$lib/modules/database/prisma";

/** @type {import('./__types/[pid]').RequestHandler} */
export async function get({ params }: { params: { pid: string; }; }) {
    let { pid } = params;

    const post = await prisma.post.findUnique({
        where: {
            pid,
        },
        include: {
            author: true,
        }
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
            message: "Post not found",
        }
    };
}
