import { json } from '@sveltejs/kit';
import { prisma } from '$lib/modules/database/prisma';
import { deleteImageFromBucket } from '$lib/modules/firebase/admin/deleteImageFromBucket';

export async function DELETE({ params, locals }: { params: { cid: string }; locals: App.Locals }) {
	const { cid } = params;

	const collection = await prisma.collection.findUnique({
		where: {
			cid
		}
	});

	if (!collection) {
		return json(
			{
				message: 'Collection not found'
			},
			{
				status: 404
			}
		);
	}

	if (collection.authorUid !== locals.user?.uid) {
		return json(
			{
				message: 'You are not authorized to delete this collection'
			},
			{
				status: 403
			}
		);
	}

	const posts = await prisma.post.findMany({
		where: {
			collectionCid: cid
		}
	});

	Promise.all(
		posts.map(async (post) => {
			deleteImageFromBucket(post);
		})
	);

	await prisma.post.deleteMany({
		where: {
			collectionCid: cid
		}
	});

	await prisma.collection.delete({
		where: {
			cid
		}
	});

	return new Response(undefined);
}

export async function GET({ params, locals }: { params: { cid: string }; locals: App.Locals }) {
	if (!locals.user) {
		return json(
			{
				message: 'You must be logged in to view a collection.'
			},
			{
				status: 401
			}
		);
	}

	const collection = await prisma.collection.findUnique({
		where: {
			cid: params.cid
		},
		include: {
			posts: {
				select: {
					pid: true
				},
				orderBy: {
					createdAt: 'asc'
				}
			},
			allowedUsers: {
				select: {
					uid: true
				}
			},
			author: true
		}
	});

	if (!collection) {
		return json(
			{
				message: 'Collection not found.'
			},
			{
				status: 404
			}
		);
	}

	if (
		collection.privacy === 'PRIVATE' &&
		!collection.allowedUsers.some((u) => u.uid === locals.user?.uid) &&
		collection.author.uid !== locals.user?.uid
	) {
		return json(
			{
				message: 'You do not have permission to view this collection.'
			},
			{
				status: 403
			}
		);
	}

	return json({
		collection
	});
}

import type { CreateOrUpdateCollectionInput } from '$lib/types/api';
import { tick } from 'svelte';

export async function POST({
	params,
	request,
	locals
}: {
	params: { cid: string };
	request: Request;
	locals: App.Locals;
}) {
	if (!locals.user) {
		return json(
			{
				message: 'You must be logged in to update a collection.'
			},
			{
				status: 401
			}
		);
	}

	const collection = await prisma.collection.findUnique({
		where: {
			cid: params.cid
		},
		include: {
			allowedUsers: {
				select: {
					uid: true
				}
			}
		}
	});

	if (!collection) {
		return json(
			{
				message: 'Collection not found.'
			},
			{
				status: 404
			}
		);
	}

	if (collection.authorUid !== locals.user.uid) {
		return json(
			{
				message: 'You do not have permission to update this collection.'
			},
			{
				status: 403
			}
		);
	}

	const data = (await request.json()) as CreateOrUpdateCollectionInput;

	const res = await prisma.collection.update({
		where: {
			cid: params.cid
		},
		data: {
			name: data.name,
			description: data.description,
			privacy: data.privacy,
			allowedUsers: {
				connect: (data.allowedUids || []).map((uid) => ({ uid })),
				disconnect: (collection.allowedUsers || [])
					.filter((user) => !data.allowedUids?.includes(user.uid))
					.map((user) => ({ uid: user.uid }))
			}
		},
		include: {
			allowedUsers: {
				select: {
					uid: true
				}
			}
		}
	});

	return json({
		collection: res
	});
}
