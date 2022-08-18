import type { UserCollectionsOutput } from '$lib/types/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, fetch, parent }) => {
	const parentData = await parent();
	const res = await fetch(`/api/users/${parentData.user?.uid}/collections`);
	const body = (await res.json()) as UserCollectionsOutput;

	if (res.status === 200) {
		return {
			user: parentData.user,
			collections: body.collections
		};
	} else {
		throw error(404, 'not found');
	}
};
