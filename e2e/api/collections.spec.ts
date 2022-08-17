import { type BrowserContext, expect, test } from '@playwright/test';
import { authenticateUser, createUser, deleteUser } from '../helpers/users.js';
import type { CreateOrUpdatePostInput, UploadImageInput } from '../../lib/types/api.js';

let context: BrowserContext;
let cmsContext: BrowserContext;

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
		baseURL: 'http://localhost:4173'
	});
	cmsContext = await browser.newContext({
		baseURL: 'http://localhost:4174'
	});
	uid1 = await createUser(context, email1, password1, username1, name1);
	uid2 = await createUser(context, email2, password2, username2, name2);
});

test.afterAll(async () => {
	await deleteUser(uid1);
	await deleteUser(uid2);
});

let collection: any;
test('collection creation', async () => {
	await authenticateUser(context, email1, password1);

	const res = await context.request.post(`/api/collections/new`, {
		data: {
			name: 'test collection',
			description: 'test description'
		}
	});

	expect(res).toBeOK();

	const body = await res.json();

	expect(body.collection.name).toBe('test collection');
	expect(body.collection.description).toBe('test description');
	expect(body.collection.cid).toBeDefined();
	expect(body.collection.authorUid).toBe(uid1);
	expect(body.collection.createdAt).toBeDefined();
	expect(body.collection.postsCount).toBe(0);
	expect(body.collection.privacy).toBe('PUBLIC');

	collection = body.collection;
});

test('collection edition', async () => {
	await authenticateUser(context, email1, password1);

	const res = await context.request.post(`/api/collections/${collection.cid}`, {
		data: {
			name: 'test collection edited',
			description: 'test description edited',
			privacy: 'PRIVATE'
		}
	});

	expect(res).toBeOK();

	const body = await res.json();

	expect(body.collection.name).toBe('test collection edited');
	expect(body.collection.description).toBe('test description edited');
	expect(body.collection.cid).toBeDefined();
	expect(body.collection.authorUid).toBe(uid1);
	expect(body.collection.createdAt).toBeDefined();
	expect(body.collection.postsCount).toBe(0);
	expect(body.collection.privacy).toBe('PRIVATE');
});

test('collection private access', async () => {
	let res = await context.request.get(`/api/collections/${collection.cid}`);
	expect(res).toBeOK();

	const body = await res.json();

	expect(body.collection.name).toBe('test collection edited');
	expect(body.collection.description).toBe('test description edited');
	expect(body.collection.cid).toBeDefined();
	expect(body.collection.authorUid).toBe(uid1);
	expect(body.collection.createdAt).toBeDefined();
	expect(body.collection.postsCount).toBe(0);
	expect(body.collection.privacy).toBe('PRIVATE');

	await authenticateUser(context, email2, password2);

	res = await context.request.get(`/api/collections/${collection.cid}`);
	expect(res.status()).toBe(403);
});

test('collection allow private access', async () => {
	await authenticateUser(context, email1, password1);

	let res = await context.request.post(`/api/collections/${collection.cid}`, {
		data: {
			allowedUids: [uid2]
		}
	});

	expect(res).toBeOK();

	await authenticateUser(context, email2, password2);

	res = await context.request.get(`/api/collections/${collection.cid}`);
	expect(res).toBeOK();

	const body = await res.json();
	expect(body.collection.allowedUsers[0].uid).toBe(uid2);
});

let collectionPosts: any[];

test('posts can be retrieved from the collection', async () => {
	await authenticateUser(context, email1, password1);
	await authenticateUser(cmsContext, email1, password1);

	const post = {
		title: 'test',
		description: 'test',
		metadataKeys: ['key1', 'key2'],
		metadataValues: ['value1', 'value2'],
		collectionCid: collection.cid
	};
	let res = await context.request.post(`/api/posts/new`, {
		data: post
	});
	expect(res).toBeOK();
	let data = await res.json();
	const input: UploadImageInput = {
		dataUrl: `data:image/webp;base64,UklGRmgAAABXRUJQVlA4TFsAAAAvC4ADEB8gEEiS3XZAgUCSP9B6CwSSPOfda/4D8FcBm9ra2hy6Ag52kFDS4+DHBCbSZ6aoYYsRMnJ+GxH9DzuQgqZi6h8NdwSI26rdK+tP2qfaJPIhchIFiRsIAA==`,
		pid: data.post.pid
	};
	res = await cmsContext.request.post('/upload', {
		data: input
	});
	expect(res).toBeOK();

	res = await context.request.get(`/api/collections/${collection.cid}/posts`);
	expect(res).toBeOK();
	data = await res.json();
	expect(data.posts.length).toBe(1);
	expect(data.posts[0].title).toBe(post.title);
	expect(data.posts[0].description).toBe(post.description);
	expect(data.posts[0].metadataKeys).toEqual(post.metadataKeys);
	expect(data.posts[0].metadataValues).toEqual(post.metadataValues);
	expect(data.posts[0].imageUrl).toBeDefined();

	collectionPosts = data.posts;
});

test('collection can be deleted', async () => {
	await authenticateUser(context, email1, password1);

	const res = await context.request.delete(`/api/collections/${collection.cid}`);
	expect(res).toBeOK();
});

test('collection is fully deleteed', async () => {
	await authenticateUser(context, email1, password1);

	let res = await context.request.get(`/api/collections/${collection.cid}`);
	expect(res.status()).toBe(404);

	res = await context.request.get(`/api/collections/${collection.cid}/posts`);
	const body = await res.json();
	expect(body.posts.length).toBe(0);

	res = await context.request.get(`/api/posts/${collectionPosts[0].pid}`);
	expect(res.status()).toBe(404);

	const page = await context.newPage();
	const pageRes = await page.goto(collectionPosts[0].imageUrl);
	expect(pageRes?.status()).toBe(404);
});