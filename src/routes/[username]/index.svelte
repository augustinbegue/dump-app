<script lang="ts">
	import PostPreview from '$lib/components/posts/PostPreview.svelte';
	import { firebaseUser } from '$lib/modules/firebase/client';
	import type { User } from '@prisma/client';
	import { onMount } from 'svelte';
	export let user: User;

	$: isLoggedInUser = user.uid === $firebaseUser?.uid;
</script>

<div class="flex flex-col md:flex-row gap-4 justify-center">
	<div class="m-4">
		<div class="card shadow-2xl bg-base-100 min-w-max h-max">
			<div class="card-body">
				<div class="avatar">
					<div class="w-24 rounded-full">
						<img src={user.photoUrl} alt="{user.username}'s profile picture" />
					</div>
				</div>
				<div class="card-title flex-col items-start gap-0">
					<p class="text-lg font-normal">@{user.username}</p>
					<p>{user.name}</p>
				</div>
				{#if isLoggedInUser}
					<a class="btn btn-sm" href="{user.username}/edit">Edit</a>
				{/if}
				<p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
			</div>
		</div>
		{#if isLoggedInUser}
			<div class="">
				<a class="btn btn-primary gap-2 mt-4" href="{user.username}/new">
					<i class="fa-solid fa-plus" />
					New Post
				</a>
			</div>
		{/if}
	</div>
	<div class="m-4">
		<div class="flex flex-row justify-between my-4">
			<div class="tabs tabs-boxed bg-base-300">
				<a class="tab tab-lg tab-active">Posts</a>
				<a class="tab tab-lg">Collections</a>
			</div>
		</div>
		<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
			{#each Array(20) as i}
				<PostPreview />
			{/each}
		</div>
	</div>
</div>
