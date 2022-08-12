<script lang="ts">
	import PostsGrid from '$lib/components/posts/PostsGrid.svelte';
	import UserDisplay from '$lib/components/users/UserDisplay.svelte';

	import type { Collection, User } from '@prisma/client';

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

<div class="flex flex-col md:flex-row gap-4 justify-center">
	<div class="m-4">
		<div class="card bg-base-200 max-w-[25%] min-w-max">
			<div class="card-body">
				<UserDisplay user={collection.author} />
				<div class="card-title flex-col items-center gap-0 font-normal">
					<p>{collection.name}</p>
					<p class="text-sm">{new Date(collection.createdAt).toLocaleDateString()}</p>
				</div>
				<p>{collection.description}</p>
				<span class="kbd w-fit">{collection.privacy.toLowerCase()}</span>
			</div>
		</div>
	</div>
	<div class="m-4">
		<PostsGrid
			endpoint={`/api/collections/${collection.cid}/posts`}
			count={collection.postsCount}
			author={collection.author}
		/>
	</div>
</div>
