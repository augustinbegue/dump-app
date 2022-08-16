import type { CollectionOutput } from '$lib/types/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, fetch, parent, params }) => {
	let res = await fetch(`/api/collections/${params.cid}`);
	const body = (await res.json()) as CollectionOutput;

	return {
		collection: body.collection
	};
};
