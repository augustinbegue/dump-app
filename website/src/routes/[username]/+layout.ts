import type { UserOutput } from '$lib/types/api';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, data, fetch, url }) => {
	const userRes = await fetch(`/api/users/username/${params.username}`);
	const userData = (await userRes.json()) as UserOutput;

	if (userRes.status === 200) {
		return {
			url: url.toString(),
			user: userData.user
		};
	} else {
		throw error(userRes.status, (userData as any).message);
	}
};
