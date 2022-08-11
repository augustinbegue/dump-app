import { prisma } from "$lib/modules/database/prisma";
import type { CreateOrUpdateCollectionInput } from "$lib/types/api";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ params, request, locals }: RequestEvent) {
    if (!locals.user) {
        return {
            status: 401,
            body: {
                message: "You must be logged in to create a collection."
            }
        };
    }

    const data = (await request.json()) as CreateOrUpdateCollectionInput;

    if (!data.name || !data.description) {
        return {
            status: 400,
            body: {
                message: "You must provide a name and a description."
            }
        };
    }
    let res;
    try {
        res = await prisma.collection.create({
            data: {
                cid: crypto.randomUUID(),
                authorUid: locals.user.uid,
                name: data.name,
                description: data.description,
                privacy: data.privacy,
                allowedUsers: {
                    connect: (data.allowedUids || []).map(uid => ({ uid }))
                }
            },
            include: {
                allowedUsers: {
                    select: {
                        uid: true,
                    }
                },
            }
        });
    } catch (error) {
        console.error(error);

        return {
            status: 500,
            body: {
                message: "An error occurred while creating the collection."
            }
        };
    }

    return {
        status: 200,
        body: {
            collection: res
        }
    };
}
