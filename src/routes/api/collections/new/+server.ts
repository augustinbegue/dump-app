import { json } from '@sveltejs/kit';
import { prisma } from '$lib/modules/database/prisma';
import type { CreateOrUpdateCollectionInput } from '$lib/types/api';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ params, request, locals }: RequestEvent) {
	if (!locals.user) {
		return json(
			{
				message: 'You must be logged in to create a collection.'
			},
			{
				status: 401
			}
		);
	}

	const data = (await request.json()) as CreateOrUpdateCollectionInput;

	if (!data.name || !data.description) {
		return json(
			{
				message: 'You must provide a name and a description.'
			},
			{
				status: 400
			}
		);
	}
	let res;
	try {
		res = await prisma.collection.create({
			data: {
				cid: crypto.randomUUID(),
				authorUid: locals.user.uid,
				name: data.name,
				description: data.description,
				privacy: data.privacy,
				allowedUsers: {
					connect: (data.allowedUids || []).map((uid) => ({ uid }))
				}
			},
			include: {
				allowedUsers: {
					select: {
						uid: true
					}
				}
			}
		});
	} catch (error) {
		console.error(error);

		return json(
			{
				message: 'An error occurred while creating the collection.'
			},
			{
				status: 500
			}
		);
	}

	return json({
		collection: res
	});
}
