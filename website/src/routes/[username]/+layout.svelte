<script lang="ts">
	import UserDisplay from '$lib/components/users/UserDisplay.svelte';
	import { firebaseUser } from '$lib/modules/firebase/client';
	import FollowsModal from '$lib/components/modals/FollowsModal.svelte';
	import FollowButton from '$lib/components/inputs/FollowButton.svelte';

	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: ({ user, url } = data);
	$: isLoggedInUser = user.uid === $firebaseUser?.uid;

	let openFollowersModal: () => void;
	let openFollowingModal: () => void;
</script>

{#key user}
	<!-- Followers Modal -->
	<FollowsModal bind:open={openFollowersModal} type="followers" {user} />
	<!-- Following Modal -->
	<FollowsModal bind:open={openFollowingModal} type="following" {user} />
{/key}

<div class="flex flex-col md:flex-row gap-4 justify-center p-4">
	<div>
		<div class="card shadow-2xl bg-base-200 min-w-max h-max">
			<div class="card-body">
				<UserDisplay {user} />
				<div class="card-title flex-col items-start gap-0">
					<p>{user.name}</p>
				</div>
				{#if !isLoggedInUser && $firebaseUser}
					<FollowButton {user} />
				{/if}
				<p class="cursor-pointer" on:click={() => openFollowersModal()}>
					<span class="font-medium">
						{user.followersCount}
					</span> followers
				</p>
				<p class="cursor-pointer" on:click={() => openFollowingModal()}>
					<span class="font-medium">
						{user.followingCount}
					</span> following
				</p>
				<p class="text-sm">joined: {new Date(user.createdAt).toLocaleDateString()}</p>
			</div>
		</div>
		{#if isLoggedInUser}
			<div class="flex flex-col">
				<a class="btn btn-primary gap-2 mt-4" href="/new"> publish </a>
			</div>
		{/if}
	</div>
	<div class="w-full">
		<div class="flex flex-row justify-between mb-4">
			<div class="tabs tabs-boxed bg-base-300 w-full md:w-max">
				<a
					class="tab md:tab-lg grow"
					href="/{user.username}"
					class:tab-active={url.endsWith(user.username)}
				>
					feed
				</a>
				<a
					class="tab md:tab-lg grow"
					href="/{user.username}/posts"
					class:tab-active={url.endsWith('posts')}
				>
					posts
				</a>
				<a
					class="tab md:tab-lg grow"
					href="/{user.username}/collections"
					class:tab-active={url.endsWith('collections')}
				>
					collections
				</a>
			</div>
		</div>
		<slot />
	</div>
</div>
