import { prisma } from "$lib/modules/database/prisma";

export async function GET({ params, locals }: { params: { uid: string; }, locals: App.Locals }) {
    const { uid } = params;

    let isLoggedInUser = locals.user && locals.user.uid === uid;

    const user = await prisma.user.findUnique({
        where: {
            uid
        },
        include: {
            createdCollections: isLoggedInUser ? true : {
                where: {
                    privacy: "PUBLIC"
                }
            },
        }
    })

    if (!user) {
        return {
            status: 404,
            body: {
                message: "User not found."
            }
        }
    }

    return {
        status: 200,
        body: {
            collections: user.createdCollections
        }
    }
}