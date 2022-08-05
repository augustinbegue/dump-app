import { prisma } from "$lib/modules/database/prisma";
import type { RequestEvent } from "@sveltejs/kit";

export async function post({ params, request, locals }: RequestEvent) {
    const data = request.json();

    console.log(locals.user);

    return {
        status: 200,
    }
}