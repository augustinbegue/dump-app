import { expect, test } from '@playwright/test';
import { authenticateUser, createUser, deleteUser } from '../helpers/users.js';

let context: any;

const name1 = 'John Doe';
const username1 = 'test1';
const email1 = 'user1test@test.test';
const password1 = 'test123456&/';
let uid1: string;

const name2 = 'John Ratio';
const username2 = 'test2';
const email2 = 'user2test@test.test';
const password2 = 'test123456&/';
let uid2: string;

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
        baseURL: 'http://localhost:4173',
    });
    uid1 = await createUser(context, email1, password1, username1, name1);
    uid2 = await createUser(context, email2, password2, username2, name2);
});

test.afterAll(async () => {
    await deleteUser(uid1);
    await deleteUser(uid2);
});

test('a user can follow another', async () => {
    await authenticateUser(context, email1, password1);
    let res = await context.request.post(`/api/users/${uid2}/followers`, {
        data: {
            uid: uid1,
        }
    });
    expect(res).toBeOK();

    await authenticateUser(context, email2, password2);
    res = await context.request.post(`/api/users/${uid1}/followers`, {
        data: {
            uid: uid2,
        }
    });
    expect(res).toBeOK();
});

test('a user follows another user', async () => {
    await authenticateUser(context, email1, password1);
    let res = (await context.request.get(`/api/users/${uid1}/following`));
    expect(res).toBeOK();

    let body = await res.json();

    expect(body.following).toHaveLength(1);
    expect(body.following[0].followerUid).toBe(uid1);
    expect(body.following[0].followingUid).toBe(uid2);

    res = (await context.request.get(`/api/users/${uid2}/followers`));
    expect(res).toBeOK();

    body = await res.json();

    expect(body.followers).toHaveLength(1);
    expect(body.followers[0].followerUid).toBe(uid1);
    expect(body.followers[0].followingUid).toBe(uid2);

    res = (await context.request.get(`/api/users/${uid2}/following/${uid1}`));
    expect(res).toBeOK();

    body = await res.json();

    expect(body.following).toHaveLength(1);
    expect(body.following[0].followerUid).toBe(uid2);
    expect(body.following[0].followingUid).toBe(uid1);
})

test('users have the right amount of followers', async () => {
    let res = (await context.request.get(`/api/users/${uid1}`));
    expect(res).toBeOK();

    let body = await res.json();

    expect(body.user.followersCount).toBe(1);
    expect(body.user.followingCount).toBe(1);

    res = (await context.request.get(`/api/users/${uid2}`));
    expect(res).toBeOK();

    body = await res.json();

    expect(body.user.followersCount).toBe(1);
    expect(body.user.followingCount).toBe(1);
})