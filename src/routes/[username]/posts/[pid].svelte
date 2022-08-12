<script lang="ts">
	import { goto } from '$app/navigation';
	import UserDisplay from '$lib/components/users/UserDisplay.svelte';

	import type { Post, User } from '@prisma/client';

	export let post: Post & {
		author: User;
	};
</script>

<div class="flex flex-col md:flex-row gap-4 justify-center">
	<div class="m-4">
		<div class="card bg-base-200 min-w-max">
			<div class="card-body">
				<UserDisplay user={post.author} />
				<div class="card-title flex-col items-center gap-0 font-normal">
					<p>{post.title}</p>
					<p class="text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
				</div>
				<p>{post.description}</p>
				<ul class="flex flex-col text-xs font-mono gap-1">
					{#each post.metadataKeys as key, i}
						<li><span class="kbd">{key}:</span> {post.metadataValues[i]}</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
	<div class="m-4">
		{#if post}
			<img class="max-w-full max-h-[70vh]" src={post.imageUrl} alt={post.title} />
		{/if}
	</div>
</div>
