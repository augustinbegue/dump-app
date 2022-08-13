import { prisma } from "$lib/modules/database/prisma";
import { deleteImageFromBucket } from "$lib/modules/firebase/admin/deleteImageFromBucket";

export async function DELETE({ params, locals }: { params: { cid: string }, locals: App.Locals }) {
    const { cid } = params;

    const collection = await prisma.collection.findUnique({
        where: {
            cid,
        }
    });

    if (!collection) {
        return {
            status: 404,
            body: {
                message: "Collection not found",
            },
        }
    }

    if (collection.authorUid !== locals.user?.uid) {
        return {
            status: 403,
            body: {
                message: "You are not authorized to delete this collection",
            },
        }
    }

    let posts = await prisma.post.findMany({
        where: {
            collectionCid: cid,
        }
    })

    Promise.all(posts.map(async (post) => { deleteImageFromBucket(post); }));

    await prisma.post.deleteMany({
        where: {
            collectionCid: cid,
        }
    });

    await prisma.collection.delete({
        where: {
            cid,
        }
    });

    return {
        status: 200,
    }
}