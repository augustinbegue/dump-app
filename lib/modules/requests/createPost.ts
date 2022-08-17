import type { CreateOrUpdatePostInput, PostOutput, UploadImageInput } from '$lib/types/api';
import type { Post } from '@prisma/client';

export async function createPost(post: CreateOrUpdatePostInput, dataUrl: string): Promise<Post> {
	const createPostBody: CreateOrUpdatePostInput = {
		collectionCid: post.collectionCid,
		metadataKeys: post.metadataKeys,
		metadataValues: post.metadataValues,
		title: post.title,
		description: post.description,
		showInFeed: post.showInFeed
	};

	let response = await fetch('/api/posts/new', {
		method: 'POST',
		body: JSON.stringify(createPostBody)
	});

	const data = (await response.json()) as PostOutput;

	const uploadImageBody: UploadImageInput = {
		pid: data.post.pid,
		dataUrl: dataUrl
	};

	response = await fetch('/upload', {
		method: 'POST',
		body: JSON.stringify(uploadImageBody)
	});

	return (await response.json()).post;
}
