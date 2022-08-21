import { json } from '@sveltejs/kit';
import { prisma } from '$lib/modules/database/prisma';
import { getQueryParams } from '$lib/modules/database/queryparams';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET({ params, url }: RequestEvent) {
	const { cid } = params;

	const { take, cursor, skip } = getQueryParams(new URL(url));
	const res = await prisma.post.findMany({
		where: {
			collectionCid: cid
		},
		take,
		skip,
		cursor: cursor
			? {
					pid: cursor
			  }
			: undefined,
		orderBy: {
			createdAt: 'asc'
		}
	});

	return json({
		posts: res
	});
}
