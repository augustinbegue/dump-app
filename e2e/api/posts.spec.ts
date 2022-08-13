import { type BrowserContext, expect, test } from '@playwright/test';
import { authenticateUser, createUser, deleteUser } from '../helpers/users.js';

let context: BrowserContext;

const name1 = 'John Ratio + L';
const username1 = 'test1posts';
const email1 = 'test1posts@test.test';
const password1 = 'test123456&/';
let uid1: string;

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
        baseURL: 'http://localhost:4173',
    });
    uid1 = await createUser(context, email1, password1, username1, name1);
});

test.afterAll(async () => {
    await deleteUser(uid1);
})

test('invalid post creations', async () => {
    let res = await context.request.post('/api/posts/new', {
        data: {}
    });
    expect(res.status()).toBe(403);

    await authenticateUser(context, email1, password1);

    res = await context.request.post('/api/posts/new', {
        data: {}
    });
    expect(res.status()).toBe(400);

    let post = {
        title: 'test',
    }
    res = await context.request.post('/api/posts/new', {
        data: post
    });
    expect(res.status()).toBe(400);
});

let dbPost: any;
test('user can create a post', async () => {
    let post = {
        title: 'test',
        description: 'test',
        metadataKeys: ['key1', 'key2'],
        metadataValues: ['value1', 'value2'],
        dataUrl: `data:image/webp;base64,UklGRmgAAABXRUJQVlA4TFsAAAAvC4ADEB8gEEiS3XZAgUCSP9B6CwSSPOfda/4D8FcBm9ra2hy6Ag52kFDS4+DHBCbSZ6aoYYsRMnJ+GxH9DzuQgqZi6h8NdwSI26rdK+tP2qfaJPIhchIFiRsIAA==`,
    }
    await authenticateUser(context, email1, password1);

    let res = await context.request.post('/api/posts/new', {
        data: post
    });
    expect(res).toBeOK();
    let data = await res.json();
    expect(data.post.title).toBe(post.title);
    expect(data.post.description).toBe(post.description);
    expect(data.post.metadataKeys).toEqual(post.metadataKeys);
    expect(data.post.metadataValues).toEqual(post.metadataValues);

    dbPost = data.post;
});

test('user can update a post', async () => {
    let post = {
        title: 'test updated',
        description: 'test updated',
        metadataKeys: ['key1', 'key2'],
        metadataValues: ['value1 updated', 'value2'],
        dataUrl: `data:image/webp;base64,UklGRmgAAABXRUJQVlA4TFsAAAAvC4ADEB8gEEiS3XZAgUCSP9B6CwSSPOfda/4D8FcBm9ra2hy6Ag52kFDS4+DHBCbSZ6aoYYsRMnJ+GxH9DzuQgqZi6h8NdwSI26rdK+tP2qfaJPIhchIFiRsIAA==`,
    }
    await authenticateUser(context, email1, password1);

    let res = await context.request.post(`/api/posts/${dbPost.pid}`, {
        data: post
    });
    expect(res).toBeOK();
    let data = await res.json();
    expect(data.post.title).toBe(post.title);
    expect(data.post.description).toBe(post.description);
    expect(data.post.metadataKeys).toEqual(post.metadataKeys);
    expect(data.post.metadataValues).toEqual(post.metadataValues);
});

test('user can delete a post', async () => {
    await authenticateUser(context, email1, password1);

    let res = await context.request.delete(`/api/posts/${dbPost.pid}`);
    expect(res).toBeOK();
});

test('post is properly deleted', async () => {
    let res = await context.request.get(`/api/posts/${dbPost.pid}`);
    expect(res.status()).toBe(404);

    let page = await context.newPage();
    let pageRes = await page.goto(dbPost.imageUrl);
    expect(pageRes?.status()).toBe(404);
})