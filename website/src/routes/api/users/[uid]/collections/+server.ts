import { json } from '@sveltejs/kit';
import { prisma } from '$lib/modules/database/prisma';

export async function GET({ params, locals }: { params: { uid: string }; locals: App.Locals }) {
	const { uid } = params;

	const isLoggedInUser = locals.user && locals.user.uid === uid;

	const user = await prisma.user.findUnique({
		where: {
			uid
		},
		include: {
			createdCollections: isLoggedInUser
				? true
				: {
						where: {
							privacy: 'PUBLIC'
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
		collections: user.createdCollections
	});
}
