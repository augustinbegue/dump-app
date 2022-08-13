import { type BrowserContext, expect, test } from '@playwright/test';
import { authenticateUser, createUser, deleteUser } from '../helpers/users.js';

let context: BrowserContext;

const name1 = 'John Doe';
const username1 = 'test1collections';
const email1 = 'test1collectionstest@test.test';
const password1 = 'test123456&/';
let uid1: string;

const name2 = 'John Ratio';
const username2 = 'test2collections';
const email2 = 'test2collectionstest@test.test';
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

let collectionId = '';
test('collection creation', async () => {
    await authenticateUser(context, email1, password1);

    let res = await context.request.post(`/api/collections/new`, {
        data: {
            name: 'test collection',
            description: 'test description',
        }
    });

    expect(res).toBeOK();

    let body = (await res.json());

    expect(body.collection.name).toBe('test collection');
    expect(body.collection.description).toBe('test description');
    expect(body.collection.cid).toBeDefined();
    expect(body.collection.authorUid).toBe(uid1);
    expect(body.collection.createdAt).toBeDefined();
    expect(body.collection.postsCount).toBe(0);
    expect(body.collection.privacy).toBe("PUBLIC");

    collectionId = body.collection.cid;
})

test('collection edition', async () => {
    await authenticateUser(context, email1, password1);

    let res = await context.request.post(`/api/collections/${collectionId}`, {
        data: {
            name: 'test collection edited',
            description: 'test description edited',
            privacy: 'PRIVATE',
        }
    });

    expect(res).toBeOK();

    let body = (await res.json());

    expect(body.collection.name).toBe('test collection edited');
    expect(body.collection.description).toBe('test description edited');
    expect(body.collection.cid).toBeDefined();
    expect(body.collection.authorUid).toBe(uid1);
    expect(body.collection.createdAt).toBeDefined();
    expect(body.collection.postsCount).toBe(0);
    expect(body.collection.privacy).toBe("PRIVATE");
})

test('collection private access', async () => {
    let res = await context.request.get(`/api/collections/${collectionId}`);
    expect(res).toBeOK();

    let body = (await res.json());

    expect(body.collection.name).toBe('test collection edited');
    expect(body.collection.description).toBe('test description edited');
    expect(body.collection.cid).toBeDefined();
    expect(body.collection.authorUid).toBe(uid1);
    expect(body.collection.createdAt).toBeDefined();
    expect(body.collection.postsCount).toBe(0);
    expect(body.collection.privacy).toBe("PRIVATE");

    await authenticateUser(context, email2, password2);

    res = await context.request.get(`/api/collections/${collectionId}`);
    expect(res.status()).toBe(403);
});

test('collection allow private access', async () => {
    await authenticateUser(context, email1, password1);

    let res = await context.request.post(`/api/collections/${collectionId}`, {
        data: {
            allowedUids: [uid2],
        }
    });

    expect(res).toBeOK();

    await authenticateUser(context, email2, password2);

    res = await context.request.get(`/api/collections/${collectionId}`);
    expect(res).toBeOK()

    let body = (await res.json());
    expect(body.collection.allowedUsers[0].uid).toBe(uid2);
})

test('collection can be deleted', async () => {
    await authenticateUser(context, email1, password1);

    let res = await context.request.delete(`/api/collections/${collectionId}`);
    expect(res).toBeOK();
});