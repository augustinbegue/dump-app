import type { PostsOutput } from '$lib/types/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, fetch, parent, params }) => {
	let res = await fetch(`/api/posts/${params.pid}`);
	const body = (await res.json()) as PostsOutput;

	return {
		posts: body.posts
	};
};
