import type { UserOutput } from '$lib/types/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, fetch, parent, params }) => {
	let res = await fetch(`/api/users/me`);
	const body = (await res.json()) as UserOutput;

	return {
		user: body.posts
	};
};
