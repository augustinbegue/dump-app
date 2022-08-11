import { prisma } from "$lib/modules/database/prisma";

export async function GET({ params, locals }: { params: { cid: string }, locals: App.Locals }) {
    if (!locals.user) {
        return {
            status: 401,
            body: {
                message: "You must be logged in to view a collection."
            }
        }
    }

    const collection = await prisma.collection.findUnique({
        where: {
            cid: params.cid
        },
        include: {
            posts: {
                select: {
                    pid: true,
                }
            },
            allowedUsers: {
                select: {
                    uid: true,
                }
            },
            author: true,
        }
    });

    if (!collection) {
        return {
            status: 404,
            body: {
                message: "Collection not found."
            }
        }
    }

    if (collection.privacy === "PRIVATE" && !collection.allowedUsers.some(u => u.uid === locals.user?.uid)) {
        return {
            status: 403,
            body: {
                message: "You do not have permission to view this collection."
            }
        }
    }

    return {
        status: 200,
        body: {
            collection
        }
    };
}