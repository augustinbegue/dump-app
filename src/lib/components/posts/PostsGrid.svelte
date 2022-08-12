<script lang="ts">
	import { browser } from '$app/env';
	import type { PostsOutput } from '$lib/types/api';
	import type { Post, User } from '@prisma/client';

	import { onMount } from 'svelte/internal';
	import InfiniteScroll from '../pagination/InfiniteScroll.svelte';
	import Spinner from '../Spinner.svelte';
	import PostPreview from './PostPreview.svelte';

	export let author: User;
	export let endpoint: string;
	export let count: number;

	let postsPerPage: number;
	let currentPage = 0;

	function setPostsPerPage() {
		window.matchMedia('(min-width: 1536px)').matches
			? (postsPerPage = 24)
			: window.matchMedia('min-width: 1280px').matches
			? (postsPerPage = 18)
			: window.matchMedia('min-width: 768px').matches
			? (postsPerPage = 12)
			: (postsPerPage = 6);
	}

	let loadingMore = false;
	let posts: Post[] = [];
	async function loadMore() {
		if (loadingMore) return;
		console.log('load more');

		let pageNumber = Math.ceil(count / postsPerPage);
		console.log(count, postsPerPage, pageNumber);

		if (currentPage + 1 > pageNumber) {
			loadingMore = false;
			return;
		}

		console.log(currentPage, pageNumber);

		loadingMore = true;
		let take = postsPerPage;
		let skip = currentPage * postsPerPage;

		let response = await fetch(`${endpoint}?take=${take}&skip=${skip}`);
		let data = (await response.json()) as PostsOutput;

		if (data.posts.length > 0) {
			currentPage++;
		}

		posts = [...posts, ...data.posts];
		loadingMore = false;
	}

	onMount(() => {
		if (browser) {
			setPostsPerPage();
			window.onresize = () => {
				setPostsPerPage();
			};
		}
		loadMore();
	});
</script>

<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
	{#each posts as post}
		<PostPreview {post} {author} />
	{/each}
	{#if loadingMore}
		<Spinner />
	{/if}
</div>
<InfiniteScroll {loadMore} />
