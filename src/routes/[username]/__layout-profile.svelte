<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	/** @type {import('./__types/[params]').Load} */
	export const load: Load = async ({ params, props, fetch, url }) => {
		let userRes = await fetch(`/api/users/username/${params.username}`);
		const userData = (await userRes.json()) as UserOutput;

		if (userRes.status === 200) {
			return {
				props: {
					url: url.toString(),
					user: userData.user
				},
				stuff: {
					user: userData.user
				}
			};
		} else {
			return {
				status: userRes.status
			};
		}
	};
</script>

<script lang="ts">
	import UserDisplay from '$lib/components/users/UserDisplay.svelte';
	import { firebaseUser } from '$lib/modules/firebase/client';
	import type { User } from '@prisma/client';
	import FollowsModal from '$lib/components/modals/FollowsModal.svelte';
	import FollowButton from '$lib/components/inputs/FollowButton.svelte';
	import type { UserOutput } from '$lib/types/api';

	export let user: User;
	export let url: string;

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

<div class="flex flex-col md:flex-row gap-4 justify-center">
	<div class="m-4">
		<div class="card shadow-2xl bg-base-200 min-w-max h-max">
			<div class="card-body">
				<UserDisplay {user} />
				<div class="card-title flex-col items-start gap-0">
					<p>{user.name}</p>
				</div>
				{#if isLoggedInUser}
					<a class="btn btn-sm" href="/settings/profile">Edit</a>
				{:else if $firebaseUser}
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
			<div class="">
				<a class="btn btn-primary gap-2 mt-4" href="{user.username}/new"> publish </a>
			</div>
		{/if}
	</div>
	<div class="m-4">
		<div class="flex flex-row justify-between my-4">
			<div class="tabs tabs-boxed bg-base-300">
				<a
					class="tab tab-lg"
					href="/{user.username}"
					class:tab-active={url.endsWith(user.username)}
				>
					feed
				</a>
				<a
					class="tab tab-lg"
					href="/{user.username}/posts"
					class:tab-active={url.endsWith('posts')}
				>
					posts
				</a>
				<a
					class="tab tab-lg"
					href="/{user.username}/collections"
					class:tab-active={url.endsWith('collections')}
				>
					collections
				</a>
			</div>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  gap-4">
			<slot />
		</div>
	</div>
</div>
