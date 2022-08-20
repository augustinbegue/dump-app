<script lang="ts">
	import { goto } from '$app/navigation';
	import UserDisplay from '$lib/components/users/UserDisplay.svelte';
	import { currentUser } from '$lib/modules/firebase/client';
	import ConfirmModal from '$lib/components/modals/ConfirmModal.svelte';

	import type { PageData } from './$types';
	import { downloadPostImage } from '$lib/modules/interaction/download';

	export let data: PageData;

	$: ({ post } = data);

	$: isAuthor = post.author.uid === $currentUser?.uid;

	let openDeleteModal: () => Promise<void>;

	function deletePost() {
		openDeleteModal()
			.then(async () => {
				let res = await fetch(`/api/posts/${post.pid}`, {
					method: 'DELETE'
				});

				if (res.ok) {
					goto(`/${post.author.username}/posts`);
				}
			})
			.catch((e) => {});
	}
</script>

<ConfirmModal title="Are you sure you want to delete this post?" bind:open={openDeleteModal} />
<div class="flex flex-col md:flex-row gap-4 justify-center p-4">
	<div class="min-w-max">
		<div class="dropdown">
			<label tabindex="0" for="" class="btn btn-ghost">
				<span class="material-icons-outlined"> more_vert </span>
			</label>
			<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
				<li>
					<button
						on:click={() => {
							downloadPostImage(post);
						}}
					>
						download
					</button>
				</li>
				{#if isAuthor}
					<li>
						<a href="{post.pid}/edit">edit</a>
					</li>
				{/if}
				{#if isAuthor}
					<li>
						<btn class="text-error" on:click={() => deletePost()}>delete</btn>
					</li>
				{/if}
			</ul>
		</div>
		<div class="card bg-base-200 min-w-max">
			<div class="card-body gap-4">
				<div class="flex flex-row justify-between gap-4">
					<div class="flex flex-row justify-start gap-4">
						<UserDisplay user={post.author} size={'sm'} />
						<div class="card-title flex-col justify-start items-start gap-0 font-normal h-fit">
							<p>{post.title}</p>
							<p class="text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
						</div>
					</div>
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
	<div class=" flex flex-row items-start justify-center">
		{#if post}
			<img class="max-w-full max-h-[70vh]" src={post.imageUrl} alt={post.title} />
		{/if}
	</div>
</div>
