<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	/** @type {import('./__types/[params]').Load} */
	export const load: Load = async ({ params, props, fetch }) => {
		const user = props.user as User;
		let postsRes = await fetch(`/api/users/${user.uid}/posts`);
		const postsData = await postsRes.json();

		if (postsRes.status === 200) {
			return {
				props: {
					...props,
					posts: postsData.posts
				}
			};
		} else {
			return {
				status: postsRes.status
			};
		}
	};
</script>

<script lang="ts">
	import PostPreview from '$lib/components/ui/posts/PostPreview.svelte';
	import UserDisplay from '$lib/components/ui/profile/UserDisplay.svelte';
	import { firebaseUser } from '$lib/modules/firebase/client';
	import type { Post, User } from '@prisma/client';
	import type { FollowingOutput } from '$lib/types/api';

	export let user: User;
	export let posts: Post[];

	$: isLoggedInUser = user.uid === $firebaseUser?.uid;
	let followedByLoggedInUser = false;
	$: $firebaseUser, checkIfLoggedInUserFollows();

	async function checkIfLoggedInUserFollows() {
		if (isLoggedInUser) return;

		if (!$firebaseUser) {
			followedByLoggedInUser = false;
		} else {
			let res = await fetch(`/api/users/${$firebaseUser?.uid}/following/${user.uid}`);
			let data = (await res.json()) as FollowingOutput;
			followedByLoggedInUser = data.following.length > 0;
		}

		console.log(followedByLoggedInUser);
	}

	async function onFollowClick() {
		if (isLoggedInUser) return;

		let res = await fetch(`/api/users/${user.uid}/followers`, {
			method: 'POST',
			body: JSON.stringify({
				uid: $firebaseUser?.uid
			})
		});

		if (followedByLoggedInUser) {
			if (res.status === 200) {
				user.followersCount--;
				followedByLoggedInUser = false;
			}
		} else {
			if (res.status === 200) {
				user.followersCount++;
				followedByLoggedInUser = true;
			}
		}
	}
</script>

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
					<button class="btn btn-sm" on:click={onFollowClick}>
						{followedByLoggedInUser ? 'following' : 'follow'}
					</button>
				{/if}
				<p><span class="font-medium">{user.followersCount}</span> followers</p>
				<p><span class="font-medium">{user.followingCount}</span> following</p>
				<p class="text-sm">joined: {new Date(user.createdAt).toLocaleDateString()}</p>
			</div>
		</div>
		{#if isLoggedInUser}
			<div class="">
				<a class="btn btn-primary gap-2 mt-4" href="{user.username}/new"> New Post </a>
			</div>
		{/if}
	</div>
	<div class="m-4">
		<div class="flex flex-row justify-between my-4">
			<div class="tabs tabs-boxed bg-base-300">
				<a class="tab tab-lg tab-active">posts</a>
				<a class="tab tab-lg">collections</a>
			</div>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  gap-4">
			{#each posts as post}
				<PostPreview {post} author={user} />
			{/each}
		</div>
	</div>
</div>
