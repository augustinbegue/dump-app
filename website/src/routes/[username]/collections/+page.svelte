<script lang="ts">
	import CollectionPreview from '$lib/components/collections/CollectionPreview.svelte';
	import CollectionsGrid from '$lib/components/collections/CollectionsGrid.svelte';
	import { firebaseUser } from '$lib/modules/firebase/client';
	import type { PageData } from "./$types"

	export let data: PageData;
	$: ({ user, collections } = data);

	$: isLoggedInUser = user.uid === $firebaseUser?.uid;
</script>

{#if collections.length === 0}
	<div class="flex flex-col justify-center items-center w-full">
		<div class="text-center">
			<h1 class="text-3xl font-bold">Nothing to see here yet...</h1>
			<p class="font-medium mt-2">
				{#if isLoggedInUser}
					click <a class="link" href="/new/post">here</a> to create a new post.
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
