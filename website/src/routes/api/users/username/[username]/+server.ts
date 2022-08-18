import { json } from '@sveltejs/kit';
import { prisma } from '$lib/modules/database/prisma';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }: { params: { username: string } }) {
	const username = params.username;

	const user = await prisma.user.findUnique({
		where: {
			username: username
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
