import { prisma } from '$lib/modules/database/prisma';
import { auth } from '$lib/modules/firebase/admin';
import type { Handle } from '@sveltejs/kit';
import { parse } from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
    let token = parse(event.request.headers.get('cookie') ?? "")['authorization'];

    if (token) {
        token = token.replace('Bearer ', '');

        let decoded = await auth.verifyIdToken(token);
        let { uid } = decoded;

        event.locals.user = await prisma.user.findUnique({ where: { uid } });
    }

    return await resolve(event);
};
