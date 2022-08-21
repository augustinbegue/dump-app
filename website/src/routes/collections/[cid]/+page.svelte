<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import PostsGrid from '$lib/components/posts/PostsGrid.svelte';
	import UserDisplay from '$lib/components/users/UserDisplay.svelte';
	import { currentUser } from '$lib/modules/firebase/client';
	import ConfirmModal from '$lib/components/modals/ConfirmModal.svelte';

	import type { PageData } from './$types';
	import { downloadPostImage } from '$lib/modules/interaction/download';
	import type { Post } from '@prisma/client';

	export let data: PageData;
	$: ({ collection } = data);

	$: isAuthor = $currentUser?.uid === collection.author.uid;

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

	let selectMode = false;
	let selectedPosts: Post[] = [];
</script>

<ConfirmModal title="Are you sure you want to delete this post?" bind:open={openDeleteModal} />
<div class="flex flex-col md:flex-row gap-4 justify-center p-4">
	<div>
		<div class="dropdown ">
			<label tabindex="0" for="" class="btn btn-ghost">
				<span class="material-icons-outlined"> more_vert </span>
			</label>
			<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
				<li>
					<button
						on:click={() => {
							selectMode = !selectMode;
						}}
					>
						select
					</button>
				</li>
				<li class:disabled={selectedPosts.length === 0}>
					<button
						disabled={selectedPosts.length === 0}
						on:click={() => {
							for (let i = 0; i < selectedPosts.length; i++) {
								const post = selectedPosts[i];
								downloadPostImage(post);
							}
						}}
					>
						download
					</button>
				</li>
				{#if isAuthor}
					<li>
						<a href="{collection.cid}/edit">edit</a>
					</li>
				{/if}
				{#if isAuthor}
					<li>
						<btn class="text-error" on:click={() => deletePost()}>delete</btn>
					</li>
				{/if}
			</ul>
		</div>

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
		bind:selectMode
		bind:selectedPosts
	/>
</div>
