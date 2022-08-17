<script lang="ts">
	import type { Post, User } from '@prisma/client';
	import PostPreview from '$lib/components/posts/PostPreview.svelte';
	import { firebaseUser } from '$lib/modules/firebase/client';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ posts, user } = data);

	$: isLoggedInUser = user.uid === $firebaseUser?.uid;
</script>

{#if posts.length === 0}
	<div class="flex flex-col justify-center items-center w-full">
		<div class="text-center">
			<h1 class="text-3xl font-bold">Nothing to see here yet...</h1>
			<p class="font-medium mt-2">
				{#if isLoggedInUser}
					click <a class="link" href="/new/post">here</a> to create a new post.
				{:else}
					{user.name} hasn't created any posts yet.
				{/if}
			</p>
		</div>
	</div>
{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
		{#each posts as post}
			<PostPreview {post} author={user} />
		{/each}
	</div>
{/if}
