import { json } from '@sveltejs/kit';
import { prisma } from '$lib/modules/database/prisma';
import { uploadImageToBucket } from '$lib/modules/firebase/admin/uploadImageToBucket';
import type { CreateOrUpdatePostInput } from '$lib/types/api';
import type { Post } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ params, request, locals }: RequestEvent) {
	if (!locals.user) {
		return json(
			{
				message: 'You must be logged in to create a post.'
			},
			{
				status: 401
			}
		);
	}

	const data = (await request.json()) as CreateOrUpdatePostInput;

	if (!data.title || !data.dataUrl) {
		return json(
			{
				message: 'You must provide a title and a dataUrl.'
			},
			{
				status: 400
			}
		);
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
		showInFeed: data.showInFeed ?? true,
		collectionCid: data.collectionCid
	};

	const ext = data.dataUrl.split(';')[0].split('/')[1];
	const fileName = `${post.pid}.${ext}`;

	if (data.dataUrl) {
		post.imageUrl = await uploadImageToBucket(data.dataUrl, `${locals.user.uid}`, fileName);

		await prisma.post.create({
			data: {
				...post
			}
		});

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
}
