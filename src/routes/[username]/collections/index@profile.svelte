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
	import type { Collection, Post, User } from '@prisma/client';

	export let collections: Collection[];
	export let user: User;
</script>

{#each collections as collection, i}
	<CollectionPreview {collection} author={user} />
{/each}
