import { prisma } from "$lib/modules/database/prisma";

export async function GET({ params }: { params: { uid: string; }; }) {
    const { uid } = params;
    const user = await prisma.user.findUnique({
        where: {
            uid
        },
        include: {
            posts: {
                where: {
                    showInFeed: true
                }
            }
        }
    })

    if (!user) {
        return {
            status: 404,
            body: {
                message: "User not found."
            }
        }
    }

    return {
        status: 200,
        body: {
            posts: user.posts
        }
    }
}