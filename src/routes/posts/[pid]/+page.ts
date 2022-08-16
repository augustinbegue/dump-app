import type { PostOutput } from '$lib/types/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, fetch, parent, params }) => {
	let res = await fetch(`/api/posts/${params.pid}`);
	const body = (await res.json()) as PostOutput;

	if (res.status != 200) {
		throw error(res.status, (body as any).message);
	}

	return {
		post: body.post
	};
};
