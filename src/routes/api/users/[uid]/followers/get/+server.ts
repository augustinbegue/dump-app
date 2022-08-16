import { prisma } from "$lib/modules/database/prisma";

export async function GET({ params, locals }: { params: { uid: string }, locals: App.Locals }) {
    const { uid } = params;

    if (!locals.user) {
        return {
            status: 401,
            body: {
                message: "Unauthorized",
            },
        }
    }

    const user = await prisma.user.findUnique({
        where: {
            uid,
        },
        include: {
            followers: true,
        }
    })

    if (!user) {
        return {
            status: 404,
            body: {
                message: "User not found",
            },
        }
    }

    return {
        status: 200,
        body: {
            followers: user.followers,
        },
    }
}