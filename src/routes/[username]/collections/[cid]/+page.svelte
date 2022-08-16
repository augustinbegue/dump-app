<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import PostsGrid from '$lib/components/posts/PostsGrid.svelte';
	import UserDisplay from '$lib/components/users/UserDisplay.svelte';
	import { currentUser } from '$lib/modules/firebase/client';

	import type { Collection, User } from '@prisma/client';

	import ConfirmModal from '$lib/components/modals/ConfirmModal.svelte';

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

	let openDeleteModal: () => Promise<void>;

	function deletePost() {
		openDeleteModal()
			.then(async () => {
				let res = await fetch(`/api/collections/${collection.cid}`, {
					method: 'DELETE'
				});

				if (res.ok) {
					goto(`/${collection.author.username}/collections`);
				}
			})
			.catch((e) => {});
	}
</script>

<ConfirmModal title="Are you sure you want to delete this post?" bind:open={openDeleteModal} />
<div class="flex flex-col md:flex-row gap-4 justify-center p-4">
	<div>
		<div class="card bg-base-200 max-w-[25%] min-w-max">
			<div class="card-body">
				<div class="flex flex-row justify-between gap-4">
					<div class="flex flex-row justify-start gap-4">
						<UserDisplay user={collection.author} size={'sm'} />
						<div class="card-title flex-col justify-start items-start gap-0 font-normal h-fit">
							<p>{collection.name}</p>
							<p class="text-sm">{new Date(collection.createdAt).toLocaleDateString()}</p>
						</div>
					</div>
					<div class="dropdown dropdown-end">
						<label tabindex="0" for="" class="btn btn-ghost">
							<span class="material-icons-outlined"> more_vert </span>
						</label>
						<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
							<li>
								{#if isAuthor}
									<a href="{collection.cid}/edit">edit</a>
								{/if}
							</li>
							<li>
								{#if isAuthor}
									<btn class="text-error" on:click={() => deletePost()}>delete</btn>
								{/if}
							</li>
						</ul>
					</div>
				</div>
				<p>{collection.description}</p>
				<span class="kbd w-fit">{collection.privacy.toLowerCase()}</span>
			</div>
		</div>
		{#if isAuthor}
			<div class="flex flex-col">
				<a class="btn btn-primary gap-2 mt-4" href="{$page.params.cid}/add"> add posts </a>
			</div>
		{/if}
	</div>
	<!-- TODO: Properly paged endpoints -->
	<PostsGrid
		endpoint={`/api/collections/${collection.cid}/posts`}
		count={collection.posts.length}
		author={collection.author}
	/>
</div>
