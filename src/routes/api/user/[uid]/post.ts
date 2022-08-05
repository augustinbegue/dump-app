import { prisma } from "$lib/modules/database/prisma";
import { auth } from "$lib/modules/firebase/admin";

export async function post({ params, request }: { params: { uid: string }, request: Request; }) {
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

    try {
        let fbUser = await auth.getUser(params.uid);

        if (!fbUser) {
            return {
                status: 400,
                body: {
                    message: "Missing/wrong uid",
                }
            };
        }

        const user = await prisma.user.create({
            data: {
                uid: params.uid,
                ...data,
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