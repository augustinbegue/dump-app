<script lang="ts">
	import type { FollowersOutput, FollowingOutput } from '$lib/types/api';

	import type { Follow, User } from '@prisma/client';
	import { onMount } from 'svelte';
	import Spinner from '../Spinner.svelte';
	import UserFollow from '../users/UserFollow.svelte';
	import Modal from './Modal.svelte';

	export let user: User;
	export let type: 'followers' | 'following';
	let follows: Follow[];

	let modal: Modal;
	export let open: () => void;
	let close: () => void;

	let loading = true;
	async function fetchFollows() {
		loading = true;

		let res = await fetch(`/api/users/${user.uid}/${type}`);
		let data = (await res.json()) as FollowersOutput | FollowingOutput;

		follows = Object.hasOwn(data, 'followers')
			? (data as FollowersOutput).followers
			: (data as FollowingOutput).following;
		loading = false;
	}

	onMount(() => {
		open = modal.open;
		close = modal.close;

		fetchFollows();
	});
</script>

<Modal bind:this={modal}>
	<btn class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" on:click={close}> ✕ </btn>
	<div class="flex flex-col gap-4">
		{#if loading}
			<Spinner />
		{:else}
			<h3 class="font-bold text-lg">{type}</h3>
			<div class="flex flex-col gap-2">
				{#if follows.length > 0}
					{#each follows as follow}
						<UserFollow {follow} {type} />
					{/each}
				{:else}
					Nothing to see here...
				{/if}
			</div>
		{/if}
	</div>
</Modal>
