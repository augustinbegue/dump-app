import { json as json$1 } from '@sveltejs/kit';
import { prisma } from '$lib/modules/database/prisma';
import { uploadImageToBucket } from '$lib/modules/firebase/admin/uploadImageToBucket';
import type { UpdateProfilePhotoInput } from '$lib/types/api';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request, locals }: RequestEvent) {
	if (!locals.user)
		return json$1(
			{ message: 'Unauthorized' },
			{
				status: 401
			}
		);

	const data = (await request.json()) as UpdateProfilePhotoInput;

	const ext = data.dataUrl.split(';')[0].split('/')[1];
	const fileName = `${locals.user.uid}.${ext}`;
	if (data.dataUrl) {
		const photoUrl = await uploadImageToBucket(data.dataUrl, `${locals.user.uid}`, fileName);

		await prisma.user.update({
			where: {
				uid: locals.user.uid
			},
			data: {
				photoUrl
			}
		});

		return new Response(undefined);
	} else {
		return json$1(
			{
				message: 'No file was uploaded.'
			},
			{
				status: 400
			}
		);
	}
}
