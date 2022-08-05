import { prisma } from '$lib/modules/database/prisma';
import { auth } from '$lib/modules/firebase/client';
import type { Handle } from '@sveltejs/kit';
import { signInWithCustomToken } from 'firebase/auth';

export const handle: Handle = async ({ event, resolve }) => {
    let token = event.request.headers.get('Authorization');

    if (token) {
        token = token.replace('Bearer ', '');

        let credentials = await signInWithCustomToken(auth, token);
        let { user } = credentials;
        let { uid } = user;

        event.locals.user = await prisma.user.findUnique({ where: { uid } });
    }

    return await resolve(event);
};
