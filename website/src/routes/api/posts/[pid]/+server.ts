import { json } from '@sveltejs/kit';
import { prisma } from '$lib/modules/database/prisma';
import { storage } from '$lib/modules/firebase/admin';
import { deleteImageFromBucket } from '$lib/modules/firebase/admin/deleteImageFromBucket';
import type { RequestEvent } from '@sveltejs/kit';
import type { CreateOrUpdatePostInput } from '$lib/types/api';

export async function DELETE({ params, locals }: RequestEvent) {
	const { pid } = params;

	const post = await prisma.post.findUnique({
		where: {
			pid
		}
	});

	if (!post) {
		return json(
			{
				message: 'Post not found'
			},
			{
				status: 404
			}
		);
	}

	if (post.authorUid !== locals.user?.uid) {
		return json(
			{
				message: 'You are not authorized to delete this post'
			},
			{
				status: 403
			}
		);
	}

	await deleteImageFromBucket(post);

	await prisma.post.delete({
		where: {
			pid
		}
	});

	return new Response(undefined);
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }: { params: { pid: string } }) {
	const { pid } = params;

	const post = await prisma.post.findUnique({
		where: {
			pid
		},
		include: {
			author: true
		}
	});

	if (post) {
		return json({
			post
		});
	}

	return json(
		{
			message: 'Post not found'
		},
		{
			status: 404
		}
	);
}

export async function POST({ params, request, locals }: RequestEvent) {
	const { pid } = params;
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

	let post = await prisma.post.findUnique({
		where: {
			pid
		}
	});

	if (locals.user?.uid != post?.authorUid) {
		return json(
			{
				message: 'You are not authorized to update this post.'
			},
			{
				status: 403
			}
		);
	}

	post = await prisma.post.update({
		where: {
			pid
		},
		data: {
			title: data.title,
			description: data.description,
			metadataKeys: data.metadataKeys,
			metadataValues: data.metadataValues,
			showInFeed: data.showInFeed ?? true,
			collectionCid: data.collectionCid
		}
	});

	return json({
		post
	});
}
