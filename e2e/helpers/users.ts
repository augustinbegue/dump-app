import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth as adminAuth } from './firebase-admin.js';
import { auth } from './firebase-client.js';
import { prisma } from './prisma.js';

/**
 * Creates a new user and returns its uid.
 * @param context The browser context.
 * @param email 
 * @param password 
 * @param username 
 * @param name 
 * @returns {Promise<string>}
 */
export async function createUser(context: any, email: string, password: string, username: string, name: string): Promise<string> {
    let uid: string;

    try {
        uid = (await adminAuth.createUser({
            email,
            password
        })).uid;
    } catch (error) {
        uid = (await adminAuth.getUserByEmail(email)).uid;
        console.error(error);
    }

    let res = await context.request.post(`/api/users/${uid}`, {
        data: {
            name: name,
            username: username,
        }
    });

    if (res.status() != 200)
        console.error(`User ${email} creation failed with status ${res.status()}`, JSON.stringify((await res.json())));

    res = await context.request.get(`/api/users/username/${username}`);

    if (res.status() != 200)
        console.error(`User ${email} creation failed with status ${res.status()}`, JSON.stringify((await res.json())));

    return uid;
}

/**
 * Deletes a user
 * @param uid 
 */
export async function deleteUser(uid: string) {
    await adminAuth.deleteUser(uid);
    await prisma.post.deleteMany({
        where: {
            authorUid: uid,
        }
    })
    await prisma.collection.deleteMany({
        where: {
            authorUid: uid,
        }
    })
    await prisma.follow.deleteMany({
        where: {
            OR: [
                {
                    followerUid: uid,
                },
                {
                    followingUid: uid,
                }
            ]
        }
    })
    await prisma.user.delete({
        where: {
            uid: uid,
        }
    });
}

export async function authenticateUser(context: any, email: string, password: string) {
    let fbUser = (await signInWithEmailAndPassword(auth, email, password)).user;

    await context.addCookies([{
        name: 'authorization',
        value: 'Bearer ' + await fbUser.getIdToken(),
        domain: 'localhost',
        path: '/',
        secure: false,
        httpOnly: true,
        sameSite: 'Strict',
        expires: Math.round((new Date().getTime() + (1000 * 60 * 30)) / 1000),
    }])
}