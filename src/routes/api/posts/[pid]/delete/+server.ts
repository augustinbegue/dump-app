import { prisma } from "$lib/modules/database/prisma";
import { storage } from "$lib/modules/firebase/admin";
import { deleteImageFromBucket } from "$lib/modules/firebase/admin/deleteImageFromBucket";
import type { RequestEvent } from "@sveltejs/kit";

export async function DELETE({ params, locals }: RequestEvent) {
    const { pid } = params;

    const post = await prisma.post.findUnique({
        where: {
            pid,
        }
    });

    if (!post) {
        return {
            status: 404,
            body: {
                message: "Post not found",
            },
        }
    }

    if (post.authorUid !== locals.user?.uid) {
        return {
            status: 403,
            body: {
                message: "You are not authorized to delete this post",
            },
        }
    }

    await deleteImageFromBucket(post);

    await prisma.post.delete({
        where: {
            pid
        }
    });

    return {
        status: 200,
    }
}