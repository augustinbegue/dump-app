import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { UploadImageInput } from '$lib/types/api';
import { uploadImageToBucket } from '$lib/modules/firebase/admin/uploadImageToBucket';
import { prisma } from '$lib/modules/database/prisma';

export const POST: RequestHandler = async ({ request, locals }) => {
	const data = (await request.json()) as UploadImageInput;

	if (!locals.user) {
		return json(
			{
				error: 'You must be logged in to upload an image.'
			},
			{
				status: 401
			}
		);
	}

	if (!data.dataUrl || !data.pid) {
		return json(
			{
				message: 'You must provide a dataUrl and a post Id.'
			},
			{
				status: 400
			}
		);
	}

	const ext = data.dataUrl.split(';')[0].split('/')[1];
	const fileName = `${data.pid}.${ext}`;

	if (data.dataUrl) {
		const imageUrl = await uploadImageToBucket(data.dataUrl, `${locals.user.uid}`, fileName);

		const post = await prisma.post.update({
			where: { pid: data.pid },
			data: {
				imageUrl
			}
		});

		console.log(
			`[${new Date().toLocaleTimeString()}] Uploaded image ${locals.user.uid}/${fileName}`
		);

		return json({
			post
		});
	} else {
		return json(
			{
				message: 'No file was uploaded.'
			},
			{
				status: 400
			}
		);
	}
};
