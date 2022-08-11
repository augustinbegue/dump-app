import { prisma } from "$lib/modules/database/prisma";

export async function POST({ params, request, locals }: { params: { uid: string }, request: Request, locals: App.Locals }) {
    const { uid: uidToFollow } = params;
    const data = await request.json();
    const { uid } = locals.user!;

    if (!uid) {
        return {
            status: 401,
            body: {
                message: "Unauthorized",
            },
        }
    }

    const follower = await prisma.user.findUnique({
        where: {
            uid,
        }
    });

    if (!follower) {
        return {
            status: 404,
            body: {
                message: "User not found",
            },
        }
    }

    const userToFollow = await prisma.user.findUnique({
        where: {
            uid: uidToFollow,
        }
    });

    if (!userToFollow) {
        return {
            status: 404,
            body: {
                message: "User to follow not found",
            },
        }
    }

    try {
        let res = await prisma.follows.findFirst({
            where: {
                followerUid: follower.uid,
                followingUid: userToFollow.uid,
            }
        })

        if (res) {
            await prisma.follows.delete({
                where: {
                    followerUid_followingUid: {
                        followerUid: follower.uid,
                        followingUid: userToFollow.uid,
                    }
                }
            });

            await prisma.user.update({
                where: {
                    uid: userToFollow.uid,
                },
                data: {
                    followersCount: {
                        decrement: 1,
                    }
                }
            });

            await prisma.user.update({
                where: {
                    uid: follower.uid,
                },
                data: {
                    followingCount: {
                        decrement: 1,
                    }
                }
            });
        } else {
            await prisma.follows.create({
                data: {
                    follower: {
                        connect: {
                            uid: follower.uid,
                        },
                    },
                    following: {
                        connect: {
                            uid: userToFollow.uid,
                        },
                    },
                },
            });

            await prisma.user.update({
                where: {
                    uid: userToFollow.uid,
                },
                data: {
                    followersCount: {
                        increment: 1,
                    }
                }
            });

            await prisma.user.update({
                where: {
                    uid: follower.uid,
                },
                data: {
                    followingCount: {
                        increment: 1,
                    }
                }
            });
        }
    } catch (error) {
        return {
            status: 400,
            body: {
                message: "An error occurred",
            }
        }
    }

    return {
        status: 200,
    }
}