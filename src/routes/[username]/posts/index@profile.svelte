<script context="module" lang="ts">
	import type { UserPostsOutput } from '$lib/types/api';
	import type { Load } from '@sveltejs/kit';

	/** @type {import('./__types/[params]').Load} */
	export const load: Load = async ({ props, fetch, stuff }) => {
		let res = await fetch(`/api/users/${stuff.user?.uid}/posts`);
		const data = (await res.json()) as UserPostsOutput;

		if (res.status === 200) {
			return {
				props: {
					user: stuff.user,
					posts: data.posts
				}
			};
		} else {
			return {
				status: res.status
			};
		}
	};
</script>

<script lang="ts">
	import type { Post, User } from '@prisma/client';
	import PostPreview from '$lib/components/posts/PostPreview.svelte';

	export let posts: Post[];
	export let user: User;
</script>

<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
	{#each posts as post}
		<PostPreview {post} author={user} />
	{/each}
</div>
