import { expect, test } from '@playwright/test';
import { prisma } from './helpers/prisma.js';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	expect(await page.textContent('h1')).toBe('DUMP');
});

test('file extensions can be retrieved', async ({ page }) => {
	let posts = await prisma.post.findMany();

	for (let post of posts) {
		let ext = post.imageUrl.split('.')[5].split('?')[0];
		expect(ext).toMatch(/^(jpg|jpeg|png|webp)$/);
	}
})