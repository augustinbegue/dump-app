import { prisma } from "$lib/modules/database/prisma";
import type { CreateOrUpdateCollectionInput } from "$lib/types/api";

export async function POST({ params, request, locals }: {
    params: { cid: string },
    request: Request,
    locals: App.Locals
}) {
    if (!locals.user) {
        return {
            status: 401,
            body: {
                message: "You must be logged in to update a collection."
            }
        };
    }

    const collection = await prisma.collection.findUnique({
        where: {
            cid: params.cid
        },
        include: {
            allowedUsers: {
                select: {
                    uid: true
                }
            }
        }
    });

    if (!collection) {
        return {
            status: 404,
            body: {
                message: "Collection not found."
            }
        };
    }

    if (collection.authorUid !== locals.user.uid) {
        return {
            status: 403,
            body: {
                message: "You do not have permission to update this collection."
            }
        };
    }

    const data = (await request.json()) as CreateOrUpdateCollectionInput;

    let res = await prisma.collection.update({
        where: {
            cid: params.cid
        },
        data: {
            name: data.name,
            description: data.description,
            privacy: data.privacy,
            allowedUsers: {
                connect: (data.allowedUids || []).map(uid => ({ uid })),
                disconnect: (collection.allowedUsers || []).filter(user => !data.allowedUids?.includes(user.uid)).map(user => ({ uid: user.uid }))
            },
        },
        include: {
            allowedUsers: {
                select: {
                    uid: true,
                }
            },
        }
    });

    return {
        status: 200,
        body: {
            collection: res
        }
    };
}