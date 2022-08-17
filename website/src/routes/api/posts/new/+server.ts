import { json } from '@sveltejs/kit';
import { prisma } from '$lib/modules/database/prisma';
import type { CreateOrUpdatePostInput } from '$lib/types/api';
import type { Post } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request, locals }: RequestEvent) {
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

	if (!data.title) {
		return json(
			{
				message: 'You must provide a title.'
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

	await prisma.post.create({
		data: {
			...post
		}
	});

	return json({
		post
	});
}
