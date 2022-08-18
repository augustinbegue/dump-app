import type { UserOutput } from '$lib/types/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, fetch, parent, params }) => {
	const res = await fetch(`/api/users/me`);
	const body = (await res.json()) as UserOutput;

	if (res.status != 200) {
		throw error(res.status, (body as any).message);
	}

	return {
		user: body.user
	};
};
