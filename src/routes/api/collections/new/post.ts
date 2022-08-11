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

    let res = await prisma.collection.create({
        data: {
            cid: params.cid,
            authorUid: locals.user.uid,
            name: data.name,
            description: data.description,
        }
    });

    return {
        status: 200,
        body: {
            collection: res
        }
    };
}
