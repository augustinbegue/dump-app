<script lang="ts">
	import { goto } from '$app/navigation';

	import type { Post, User } from '@prisma/client';
	import { onMount } from 'svelte';
	export let post: Post;
	export let author: User;

	let container: HTMLElement;

	onMount(() => {
		(container.childNodes[2] as HTMLElement).style.opacity = '0';

		container.onmouseenter = () => {
			(container.childNodes[2] as HTMLElement).style.opacity = '1';
		};

		container.onmouseleave = () => {
			(container.childNodes[2] as HTMLElement).style.opacity = '0';
		};

		container.onclick = () => {
			goto(`/posts/${post.pid}`);
		};
	});
</script>

<div bind:this={container} class="card bg-base-100 shadow-xl image-full h-fit cursor-pointer">
	<figure>
		<img
			src={post.imageUrl}
			alt={post.title}
			style="height: auto !important;"
			class="w-full object-center"
		/>
	</figure>
	<div class="card-body">
		<div class="card-title flex-col items-start gap-0 font-normal">
			<p>{post.title}</p>
			<p class="text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
		</div>
		<p>{post.description}</p>
	</div>
</div>

<style lang="postcss">
	.card.image-full:before {
		@apply transition-all;
		opacity: 0;
	}

	.card.image-full:hover:before {
		opacity: 0.5;
	}
</style>
