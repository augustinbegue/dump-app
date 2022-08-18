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
			followers: true
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
		followers: user.followers
	});
}

export async function POST({
	params,
	request,
	locals
}: {
	params: { uid: string };
	request: Request;
	locals: App.Locals;
}) {
	const { uid: uidToFollow } = params;
	const data = await request.json();
	const { uid } = locals.user!;

	if (!uid) {
		return json(
			{
				message: 'Unauthorized'
			},
			{
				status: 401
			}
		);
	}

	const follower = await prisma.user.findUnique({
		where: {
			uid
		}
	});

	if (!follower) {
		return json(
			{
				message: 'User not found'
			},
			{
				status: 404
			}
		);
	}

	const userToFollow = await prisma.user.findUnique({
		where: {
			uid: uidToFollow
		}
	});

	if (!userToFollow) {
		return json(
			{
				message: 'User to follow not found'
			},
			{
				status: 404
			}
		);
	}

	try {
		const res = await prisma.follow.findFirst({
			where: {
				followerUid: follower.uid,
				followingUid: userToFollow.uid
			}
		});

		if (res) {
			await prisma.follow.delete({
				where: {
					followerUid_followingUid: {
						followerUid: follower.uid,
						followingUid: userToFollow.uid
					}
				}
			});

			await prisma.user.update({
				where: {
					uid: userToFollow.uid
				},
				data: {
					followersCount: {
						decrement: 1
					}
				}
			});

			await prisma.user.update({
				where: {
					uid: follower.uid
				},
				data: {
					followingCount: {
						decrement: 1
					}
				}
			});
		} else {
			await prisma.follow.create({
				data: {
					follower: {
						connect: {
							uid: follower.uid
						}
					},
					following: {
						connect: {
							uid: userToFollow.uid
						}
					}
				}
			});

			await prisma.user.update({
				where: {
					uid: userToFollow.uid
				},
				data: {
					followersCount: {
						increment: 1
					}
				}
			});

			await prisma.user.update({
				where: {
					uid: follower.uid
				},
				data: {
					followingCount: {
						increment: 1
					}
				}
			});
		}
	} catch (error) {
		return json(
			{
				message: 'An error occurred'
			},
			{
				status: 400
			}
		);
	}

	return new Response(undefined);
}
