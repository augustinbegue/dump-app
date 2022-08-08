import { expect, test } from '@playwright/test';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../helpers/firebase-client.js';
import { auth as adminAuth } from '../helpers/firebase-admin.js';
import { prisma } from '../helpers/prisma.js'

export let context: any;

const name = 'John Doe';
const username = 'test';
const email = 'usertest@test.test';
const password = 'test123456&/';
let uid: string;
let expectedBody = {
    user: {
        uid: '',
        username,
        name,
        createdAt: expect.any(String),
        photoUrl: "/static/images/default-user-photo.png",
    }
}

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    try {
        await prisma.user.delete({
            where: {
                username: username,
            }
        });
    } catch (e) { }

    try {
        let user = await adminAuth.getUserByEmail(email);
        await adminAuth.deleteUser(user.uid);
    } catch (e) { }

    context = await browser.newContext({
        baseURL: 'http://localhost:4173',
    });
});

test('user creation', async () => {
    // Create firebase user
    let fbUser = (await createUserWithEmailAndPassword(auth, email, password)).user;
    uid = fbUser.uid;
    expectedBody.user.uid = uid;

    // Test incorrect requests
    let res = await context.request.post(`/api/user/${uid}`, {
        data: {}
    });
    expect(res).not.toBeOK();
    res = await context.request.post(`/api/user/${uid}`, {
        data: {
            name
        }
    });
    expect(res).not.toBeOK();
    res = await context.request.post(`/api/user/${uid}`, {
        data: {
            username
        }
    });
    expect(res).not.toBeOK();

    // Test the user creation on the api
    res = await context.request.post(`/api/user/${uid}`, {
        data: {
            username,
            name,
            test: 'ratio',
        }
    });
    expect(res).toBeOK();

    const body = await (res.json());

    expect(body).toEqual(expectedBody);
    expect(body).not.toHaveProperty('test');
});

test('user exists after creation', async () => {
    let res = await context.request.get(`/api/user/username/${username}`);
    expect(res).toBeOK();
    let body = await (res.json());
    expect(body).toEqual(expectedBody);

    res = await context.request.get(`/api/user/${body.user.uid}`);
    expect(res).toBeOK();
    body = await (res.json());
    expect(body).toEqual(expectedBody);
})

test('user can authenticate its requests', async ({ browser }) => {
    let fbUser = (await signInWithEmailAndPassword(auth, email, password)).user;

    context.addCookies([{
        name: 'authorization',
        value: await fbUser.getIdToken(),
        domain: 'localhost',
        path: '/',
        secure: false,
        httpOnly: true,
        sameSite: 'Strict',
        expires: Math.round((new Date().getTime() + (1000 * 60 * 30)) / 1000),
    }])

    let res = await context.request.get(`/api/user/me`);
    expect(res).toBeOK();
    let body = await (res.json());
    expect(body).toEqual(expectedBody);
})

test.afterAll(async () => {
    await prisma.user.delete({
        where: {
            username: username,
        }
    });

    let user = await adminAuth.getUserByEmail(email);
    await adminAuth.deleteUser(user.uid);
});