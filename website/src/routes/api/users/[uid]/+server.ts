import { json } from '@sveltejs/kit';
import { prisma } from '$lib/modules/database/prisma';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }: { params: { uid: string } }) {
	const uid = params.uid;

	const user = await prisma.user.findUnique({
		where: {
			uid: uid
		}
	});

	if (user) {
		return json({
			user
		});
	}

	return json(
		{
			message: 'User not found'
		},
		{
			status: 404
		}
	);
}

import { auth } from '$lib/modules/firebase/admin';
import type { CreateOrUpdateUserInput } from '$lib/types/api';

export async function POST({ params, request }: { params: { uid: string }; request: Request }) {
	try {
		const data = (await request.json()) as CreateOrUpdateUserInput;

		if (!params.uid) {
			return json(
				{
					message: 'Missing/wrong uid'
				},
				{
					status: 400
				}
			);
		}

		if (!data.username) {
			return json(
				{
					message: 'Missing username'
				},
				{
					status: 400
				}
			);
		}

		if (!data.name) {
			return json(
				{
					message: 'Missing name'
				},
				{
					status: 400
				}
			);
		}

		const fbUser = await auth.getUser(params.uid);

		if (!fbUser) {
			return json(
				{
					message: 'Missing/wrong uid'
				},
				{
					status: 400
				}
			);
		}

		const user = await prisma.user.upsert({
			where: {
				uid: params.uid
			},
			update: {
				username: data.username,
				name: data.name
			},
			create: {
				uid: params.uid,
				name: data.name,
				username: data.username
			}
		});

		return json({
			user
		});
	} catch (error) {
		return json(
			{
				message: error
			},
			{
				status: 400
			}
		);
	}
}
