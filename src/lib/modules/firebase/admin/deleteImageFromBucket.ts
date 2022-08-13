import type { Post } from "@prisma/client";
import { storage } from ".";

export async function deleteImageFromBucket(post: Post) {
    let ext = post.imageUrl.split('.')[5].split('?')[0];
    await storage.bucket().file(`${post.authorUid}/${post.pid}.${ext}`).delete();
}