import type { CollectionOutput } from '$lib/types/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, fetch, parent, params }) => {
	const res = await fetch(`/api/collections/${params.cid}`);

	const body = (await res.json()) as CollectionOutput;

	if (res.status != 200) {
		throw error(res.status, (body as any).message);
	}

	return {
		collection: body.collection
	};
};
