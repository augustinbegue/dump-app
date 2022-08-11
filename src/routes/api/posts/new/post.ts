import { prisma } from "$lib/modules/database/prisma";
import { uploadImageToBucket } from "$lib/modules/firebase/admin/uploadImageToBucket";
import type { CreateOrUpdatePostInput } from "$lib/types/api";
import type { Post } from "@prisma/client";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ params, request, locals }: RequestEvent) {
    if (!locals.user) {
        return {
            status: 401,
            body: {
                message: "You must be logged in to create a post."
            }
        };
    }

    const data = await request.json() as CreateOrUpdatePostInput;

    if (!data.title || !data.dataUrl || !data.showInFeed) {
        return {
            status: 400,
            body: {
                message: "You must provide a title and a dataUrl."
            }
        };
    }

    const post: Post = {
        title: data.title,
        description: data.description,
        authorUid: locals.user?.uid,
        createdAt: new Date(),
        pid: crypto.randomUUID(),
        imageUrl: '',
        metadataKeys: data.metadataKeys,
        metadataValues: data.metadataValues,
        collectionCid: data.collectionCid,
        showInFeed: data.showInFeed
    }

    const ext = data.dataUrl.split(';')[0].split('/')[1];
    const fileName = `${post.pid}.${ext}`;

    if (data.dataUrl) {
        post.imageUrl = await uploadImageToBucket(data.dataUrl, `${locals.user.uid}`, fileName);

        await prisma.post.create({
            data: {
                ...post
            },
        });

        return {
            status: 200,
            body: {
                post
            }
        };
    } else {
        return {
            status: 400,
            body: {
                message: "No file was uploaded."
            }
        }
    }
}