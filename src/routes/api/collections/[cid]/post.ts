import { prisma } from "$lib/modules/database/prisma";
import type { CreateOrUpdateCollectionInput } from "$lib/types/api";

export async function POST({ params, request, locals }: {
    params: { cid: string },
    request: Request,
    locals: App.Locals
}) {
    if (!locals.user) {
        return {
            status: 401,
            body: {
                message: "You must be logged in to update a collection."
            }
        };
    }

    const collection = await prisma.collection.findUnique({
        where: {
            cid: params.cid
        }
    });

    if (!collection) {
        return {
            status: 404,
            body: {
                message: "Collection not found."
            }
        };
    }

    if (collection.authorUid !== locals.user.uid) {
        return {
            status: 403,
            body: {
                message: "You do not have permission to update this collection."
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

    let res = await prisma.collection.update({
        where: {
            cid: params.cid
        },
        data: {
            name: data.name,
            description: data.description
        }
    });

    return {
        status: 200,
        body: {
            collection: res
        }
    };
}