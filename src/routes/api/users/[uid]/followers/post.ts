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
    } catch (error) {
        return {
            status: 400,
            body: {
                message: "Already following",
            }
        }
    }

    return {
        status: 200,
    }
}