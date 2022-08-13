import { prisma } from "$lib/modules/database/prisma";
import { uploadImageToBucket } from "$lib/modules/firebase/admin/uploadImageToBucket";
import type { CreateOrUpdatePostInput } from "$lib/types/api";
import type { Post } from "@prisma/client";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ params, request, locals }: RequestEvent) {
    let { pid } = params;
    const data = await request.json() as CreateOrUpdatePostInput;

    if (!data.title) {
        return {
            status: 400,
            body: {
                message: "You must provide a title."
            }
        };
    }

    const post = await prisma.post.findUnique({
        where: {
            pid,
        }
    });

    if (locals.user?.uid != post?.authorUid) {
        return {
            status: 403,
            body: {
                message: "You are not authorized to update this post.",
            },
        };
    }

    await prisma.post.update({
        where: {
            pid,
        },
        data: {
            title: data.title,
            description: data.description,
            metadataKeys: data.metadataKeys,
            metadataValues: data.metadataValues,
            showInFeed: data.showInFeed ?? true,
            collectionCid: data.collectionCid,
        },
    })

    return {
        status: 200,
        body: {
            post
        }
    };
}