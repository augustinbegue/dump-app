
import type { LayoutLoad } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ url }) => {
	return {
		url: url.toString()
	};
};
