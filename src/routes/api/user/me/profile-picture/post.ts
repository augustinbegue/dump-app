import { prisma } from "$lib/modules/database/prisma";
import { uploadImageToBucket } from "$lib/modules/firebase/admin/uploadImageToBucket";
import type { RequestEvent } from "@sveltejs/kit";

export async function post({ request, locals }: RequestEvent) {
    if (!locals.user)
        return { status: 401, body: { message: "Unauthorized" } };

    const data = await request.json();

    const ext = data.dataUrl.split(';')[0].split('/')[1];
    const fileName = `${locals.user.uid}.${ext}`;
    if (data.dataUrl) {
        let photoUrl = await uploadImageToBucket(data.dataUrl, `${locals.user.uid}`, fileName);

        await prisma.user.update({
            where: {
                uid: locals.user.uid
            },
            data: {
                photoUrl
            }
        });

        return {
            status: 200,
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