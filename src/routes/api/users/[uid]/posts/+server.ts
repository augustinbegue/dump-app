import { json } from '@sveltejs/kit';
import { prisma } from '$lib/modules/database/prisma';

export async function GET({ params }: { params: { uid: string } }) {
	const { uid } = params;
	const user = await prisma.user.findUnique({
		where: {
			uid
		},
		include: {
			posts: {
				where: {
					showInFeed: true
				}
			}
		}
	});

	if (!user) {
		return json(
			{
				message: 'User not found.'
			},
			{
				status: 404
			}
		);
	}

	return json({
		posts: user.posts
	});
}
