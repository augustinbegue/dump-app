import { prisma } from "$lib/modules/database/prisma";
import { storage } from "$lib/modules/firebase/admin";
import type { Post } from "@prisma/client";
import type { RequestEvent } from "@sveltejs/kit";

export async function post({ params, request, locals }: RequestEvent) {
    if (!locals.user) {
        return {
            status: 401,
            body: {
                success: false,
                error: "You must be logged in to create a post."
            }
        };
    }

    const data = await request.json();

    const post: Post = {
        title: data.title,
        description: data.description,
        authorUid: locals.user?.uid,
        createdAt: new Date(),
        pid: crypto.randomUUID(),
        imageUrl: '',
    }

    const ext = data.dataUrl.split(';')[0].split('/')[1];
    const contentType = data.dataUrl.split(';')[0].split(':')[1];
    const fileName = `${post.pid}.${ext}`;
    const buffer = Buffer.from(data.dataUrl.split(',')[1], 'base64')

    if (data.dataUrl) {
        const storedFile = storage.bucket().file(`${locals.user.uid}/${fileName}`);
        await storedFile.save(buffer, { contentType });

        post.imageUrl = (await storedFile.getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
        }))[0];

        await prisma.post.create({
            data: post
        });

        return {
            status: 200,
            body: {
                success: true,
                post
            }
        };
    } else {
        return {
            status: 400,
            body: {
                success: false,
                error: "No file was uploaded."
            }
        }
    }
}