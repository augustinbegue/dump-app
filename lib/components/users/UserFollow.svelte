<script lang="ts">
	import type { Follow, User } from '@prisma/client';
	import { onMount } from 'svelte';
	import FollowButton from '../inputs/FollowButton.svelte';
	import Spinner from '../Spinner.svelte';

	export let follow: Follow;
	export let type: 'followers' | 'following';

	let user: User;
	let loading = true;
	async function fetchFollow() {
		loading = true;

		if (type === 'followers') {
			let res = await fetch(`/api/users/${follow.followerUid}`);
			user = (await res.json()).user as User;
		} else {
			let res = await fetch(`/api/users/${follow.followingUid}`);
			user = (await res.json()).user as User;
		}

		loading = false;
	}

	onMount(() => {
		fetchFollow();
	});
</script>

{#if loading}
	<button class:loading />
{:else}
	<div class="flex flex-row my-2 gap-2 items-center">
		<div class="avatar">
			<div class="avatar">
				<div class="w-8 rounded-full">
					<img src={user.photoUrl} alt={user.username} />
				</div>
			</div>
		</div>
		<div>
			{user.username}
		</div>
		<FollowButton {user} />
	</div>
{/if}
