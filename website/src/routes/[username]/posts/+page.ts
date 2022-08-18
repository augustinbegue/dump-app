import type { PostsOutput } from '$lib/types/api';
import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, fetch, parent }) => {
	const parentData = await parent();
	const res = await fetch(`/api/users/${parentData.user?.uid}/posts`);
	const json = (await res.json()) as PostsOutput;

	if (res.status === 200) {
		return {
			user: parentData.user,
			posts: json.posts
		};
	} else {
		throw error(404, 'not found');
	}
};
