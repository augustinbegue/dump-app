<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PostsOutput } from '$lib/types/api';

	import type { Collection, Post, User } from '@prisma/client';
	import { onMount } from 'svelte';
	import Spinner from '../Spinner.svelte';
	export let collection: Collection;
	export let author: User;

	let container: HTMLElement;

	let hasCover = false;
	async function fetchCoverPost() {
		let res = await fetch(`/api/collections/${collection.cid}/posts?take=1`);
		const data = (await res.json()) as PostsOutput;

		if (res.status === 200) {
			hasCover = true;
			return data.posts[0];
		} else {
			hasCover = false;
			return null;
		}
	}

	onMount(() => {
		container.onclick = () => {
			goto(`/collections/${collection.cid}`);
		};
	});
</script>

<div
	bind:this={container}
	class="card bg-base-100 shadow-xl h-fit w-full cursor-pointer"
	class:image-full={hasCover}
>
	<figure>
		{#await fetchCoverPost()}
			<Spinner />
		{:then coverPost}
			{#if coverPost}
				<img
					src={coverPost.imageUrl}
					alt={collection.name}
					style="height: auto !important;"
					class="w-full object-center"
				/>
			{/if}
		{/await}
	</figure>
	<div class="card-body">
		<div class="card-title flex-col items-start gap-0 font-normal">
			<p>{collection.name}</p>
			<p class="text-sm">{new Date(collection.createdAt).toLocaleDateString()}</p>
		</div>
		<p>{collection.description}</p>
	</div>
</div>

<style lang="postcss">
	.card.image-full:before {
		opacity: 0.5;
	}
</style>
