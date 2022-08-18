import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	return new Response(null, {
		status: 301,
		headers: {
			Location: 'https://dump-app-dev.vercel.app/'
		}
	});
};
