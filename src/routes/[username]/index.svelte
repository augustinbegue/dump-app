<script lang="ts">
	import PostPreview from '$lib/components/posts/PostPreview.svelte';
	import { firebaseUser } from '$lib/modules/firebase/client';
	import type { User } from '@prisma/client';
	import { onMount } from 'svelte';
	export let user: User;

	$: isLoggedInUser = user.uid === $firebaseUser?.uid;

	onMount(() => {
		console.log(user);
	});
</script>

<div class="flex flex-col md:flex-row gap-4 justify-center">
	<div class="card shadow-2xl bg-base-100 min-w-max h-max m-4">
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
			<p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
		</div>
	</div>
	<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 m-4">
		{#each Array(20) as i}
			<PostPreview />
		{/each}
	</div>
</div>
