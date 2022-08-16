<script context="module" lang="ts">
	import type { UserCollectionsOutput } from '$lib/types/api';
	import type { Load } from '@sveltejs/kit';

	/** @type {import('./__types/[params]').Load} */
	export const load: Load = async ({ props, fetch, stuff }) => {
		let res = await fetch(`/api/users/${stuff.user?.uid}/collections`);
		const data = (await res.json()) as UserCollectionsOutput;

		if (res.status === 200) {
			return {
				props: {
					user: stuff.user,
					collections: data.collections
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
	import CollectionPreview from '$lib/components/collections/CollectionPreview.svelte';
	import CollectionsGrid from '$lib/components/collections/CollectionsGrid.svelte';
	import type { Collection, Post, User } from '@prisma/client';
	import { firebaseUser } from '$lib/modules/firebase/client';

	export let collections: Collection[];
	export let user: User;

	$: isLoggedInUser = user.uid === $firebaseUser?.uid;
</script>

{#if collections.length === 0}
	<div class="flex flex-col justify-center items-center w-full">
		<div class="text-center">
			<h1 class="text-3xl font-bold">Nothing to see here yet...</h1>
			<p class="font-medium mt-2">
				{#if isLoggedInUser}
					click <a class="link" href="/{user.username}/new/post">here</a> to create a new post.
				{:else}
					{user.name} hasn't created any collections yet.
				{/if}
			</p>
		</div>
	</div>
{:else}
	<CollectionsGrid>
		{#each collections as collection, i}
			<CollectionPreview {collection} author={user} />
		{/each}
	</CollectionsGrid>
{/if}
