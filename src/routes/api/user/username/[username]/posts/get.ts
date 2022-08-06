import { prisma } from "$lib/modules/database/prisma";

export async function get({ params }: { params: { username: string; }; }) {
    const { username } = params;
    const user = await prisma.user.findUnique({
        where: {
            username
        },
        include: {
            Posts: true
        }
    })

    if (!user) {
        return {
            status: 404,
            body: {
                error: "User not found."
            }
        }
    }

    return {
        status: 200,
        body: {
            posts: user.Posts
        }
    }
}