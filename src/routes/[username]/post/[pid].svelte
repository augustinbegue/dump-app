<script lang="ts">
	import type { Post } from '@prisma/client';

	export let post: Post;
</script>

{#if post}
	<img src={post.imageUrl} alt={post.title} />
{/if}
