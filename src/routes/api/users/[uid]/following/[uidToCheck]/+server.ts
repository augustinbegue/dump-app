import { json } from '@sveltejs/kit';
import { prisma } from '$lib/modules/database/prisma';

export async function GET({ params, locals }: { params: { uid: string }; locals: App.Locals }) {
	const { uid } = params;

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

	const user = await prisma.user.findUnique({
		where: {
			uid
		},
		include: {
			following: true
		}
	});

	if (!user) {
		return json(
			{
				message: 'User not found'
			},
			{
				status: 404
			}
		);
	}

	return json({
		following: user.following
	});
}
