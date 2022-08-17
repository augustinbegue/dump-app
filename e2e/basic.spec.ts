import { expect, test } from '@playwright/test';
import { prisma } from './helpers/prisma.js';

test('file extensions can be retrieved', async () => {
	const posts = await prisma.post.findMany();

	for (const post of posts) {
		const ext = post.imageUrl.split('.')[5].split('?')[0];
		expect(ext).toMatch(/^(jpg|jpeg|png|webp)$/);
	}
});