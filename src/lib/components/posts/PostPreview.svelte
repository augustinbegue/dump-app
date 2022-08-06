<script lang="ts">
	import type { Post } from '@prisma/client';
	import { onMount } from 'svelte';
	export let post: Post;

	let container: HTMLElement;

	onMount(() => {
		(container.childNodes[2] as HTMLElement).style.opacity = '0';

		container.onmouseenter = () => {
			(container.childNodes[2] as HTMLElement).style.opacity = '1';
		};

		container.onmouseleave = () => {
			(container.childNodes[2] as HTMLElement).style.opacity = '0';
		};
	});
</script>

<div bind:this={container} class="card bg-base-100 shadow-xl image-full h-fit max-w-1/4">
	<figure>
		<img
			src={post.imageUrl}
			alt={post.title}
			style="height: auto !important;"
			class="w-full object-center"
		/>
	</figure>
	<div class="card-body">
		<h2 class="card-title">{post.title}</h2>
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
