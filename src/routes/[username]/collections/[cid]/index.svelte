<script lang="ts">
	import { page } from '$app/stores';

	import PostsGrid from '$lib/components/posts/PostsGrid.svelte';
	import UserDisplay from '$lib/components/users/UserDisplay.svelte';
	import { currentUser } from '$lib/modules/firebase/client';

	import type { Collection, User } from '@prisma/client';

	$: isAuthor = $currentUser?.uid === collection.author.uid;

	export let collection: Collection & {
		author: User;
		posts: {
			pid: string;
		}[];
		allowedUsers: {
			uid: string;
		}[];
	};
</script>

<div class="flex flex-col md:flex-row gap-4 justify-center p-4">
	<div>
		<div class="card bg-base-200 max-w-[25%] min-w-max">
			<div class="card-body">
				<UserDisplay user={collection.author} />
				<div class="card-title flex-col items-center gap-0 font-normal">
					<p>{collection.name}</p>
					<p class="text-sm">{new Date(collection.createdAt).toLocaleDateString()}</p>
				</div>
				<p>{collection.description}</p>
				<span class="kbd w-fit">{collection.privacy.toLowerCase()}</span>
				{#if isAuthor}
					<div class="card-actions justify-start">
						<a class="btn btn-sm btn-primary" href="{$page.params.cid}/edit">edit</a>
					</div>
				{/if}
			</div>
		</div>
		{#if isAuthor}
			<div class="flex flex-col">
				<a class="btn btn-primary gap-2 mt-4" href="{$page.params.cid}/add"> add posts </a>
			</div>
		{/if}
	</div>
	<PostsGrid
		endpoint={`/api/collections/${collection.cid}/posts`}
		count={collection.postsCount}
		author={collection.author}
	/>
</div>
