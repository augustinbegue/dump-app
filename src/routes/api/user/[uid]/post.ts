import { prisma } from "$lib/modules/database/prisma";
import { auth } from "$lib/modules/firebase/admin";

export async function POST({ params, request }: { params: { uid: string }, request: Request; }) {
    try {
        const data = await request.json();

        if (!params.uid) {
            return {
                status: 400,
                body: {
                    message: "Missing/wrong uid",
                }
            };
        }

        if (!data.username) {
            return {
                status: 400,
                body: {
                    message: "Missing username",
                }
            };
        }

        if (!data.name) {
            return {
                status: 400,
                body: {
                    message: "Missing name",
                }
            };
        }

        let fbUser = await auth.getUser(params.uid);

        if (!fbUser) {
            return {
                status: 400,
                body: {
                    message: "Missing/wrong uid",
                }
            };
        }

        const user = await prisma.user.upsert({
            where: {
                uid: params.uid,
            },
            update: {
                username: data.username,
                name: data.name,
            },
            create: {
                uid: params.uid,
                name: data.name,
                username: data.username,
            },
        });

        return {
            body: {
                user,
            },
        };
    } catch (error) {
        return {
            status: 400,
            body: {
                message: error,
            }
        };
    }
}