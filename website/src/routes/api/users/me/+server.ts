import { json } from '@sveltejs/kit';
import { prisma } from '$lib/modules/database/prisma';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET({ params, locals }: RequestEvent) {
	if (!locals.user) {
		return json(
			{
				message: 'Unauthorized'
			},
			{
				status: 401
			}
		);
	}

	const { uid } = locals.user;

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

export async function POST({ request, locals }: RequestEvent) {
	if (!locals.user) {
		return json(
			{
				message: 'Unauthorized'
			},
			{
				status: 401
			}
		);
	}

	const data = await request.json();

	const { uid } = locals.user;

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

	try {
		const fbUser = await auth.getUser(uid);

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
				uid: uid
			},
			update: {
				username: data.username,
				name: data.name
			},
			create: {
				uid: uid,
				username: data.username,
				name: data.name
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
