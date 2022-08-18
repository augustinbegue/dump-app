import { prisma } from '$lib/modules/database/prisma';
import { auth } from '$lib/modules/firebase/admin';
import type { Handle } from '@sveltejs/kit';
import { parse } from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
    let token = parse(event.request.headers.get('cookie') ?? "")['authorization'];

    if (token) {
        try {
            token = token.replace('Bearer ', '');

            const decoded = await auth.verifyIdToken(token);
            const { uid } = decoded;

            event.locals.user = await prisma.user.findUnique({ where: { uid } });
        } catch (error) {
            console.error(error);

            const response = await resolve(event);
            response.headers.set('Set-Cookie', 'authorization=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;');

            return response;
        }
    }

    return await resolve(event);
};
