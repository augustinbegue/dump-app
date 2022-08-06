<script lang="ts">
	import { goto } from '$app/navigation';
	import UserDisplay from '$lib/components/ui/profile/UserDisplay.svelte';

	import type { Post, User } from '@prisma/client';

	export let post: Post & {
		author: User;
	};
</script>

<div
	class="h-full flex flex-col justify-start items-center md:flex-row md:justify-center md:items-start gap-4"
>
	<div class="card bg-base-200">
		<div class="card-body">
			<UserDisplay user={post.author} />
			<div class="card-title flex-col items-center gap-0 font-normal">
				<p>{new Date(post.createdAt).toLocaleDateString()}</p>
			</div>
		</div>
	</div>
	{#if post}
		<img class="max-h-[70vh]" src={post.imageUrl} alt={post.title} />
	{/if}
</div>
