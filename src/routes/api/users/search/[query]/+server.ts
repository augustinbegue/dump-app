import { json } from '@sveltejs/kit';
import { prisma } from "$lib/modules/database/prisma";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ params, locals }: RequestEvent) {
    const { query } = params;
    const users = await prisma.user.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: query
                    }
                },
                {
                    username: {
                        contains: query
                    }
                }
            ]
        },
        take: 10
    })

    return json({ users });
}