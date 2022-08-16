import { prisma } from "$lib/modules/database/prisma";
import { getQueryParams } from "$lib/modules/database/queryparams";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ params, url }: RequestEvent) {
    const { cid } = params;

    let { take, cursor, skip } = getQueryParams(new URL(url));
    let res = await prisma.post.findMany({
        where: {
            collectionCid: cid,
        },
        take,
        skip,
        cursor: cursor ? {
            pid: cursor,
        } : undefined,
    })

    return {
        status: 200,
        body: {
            posts: res,
        },
    };
}