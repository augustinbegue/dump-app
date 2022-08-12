<script lang="ts">
	import { browser } from '$app/env';

	import { onMount } from 'svelte';

	export let horizontal = false;
	export let threshold = 200;
	export let loadMore: () => void;
	let loadingMore = false;

	function onscroll(e: Event) {
		let el = document.querySelector('html');

		if (!el) return;

		const offset = horizontal
			? el.scrollWidth - el.clientWidth - el.scrollLeft
			: el.scrollHeight - el.clientHeight - el.scrollTop;

		if (offset <= threshold) {
			if (!loadingMore) {
				loadMore?.();
			}
			loadingMore = true;
		} else {
			loadingMore = false;
		}
	}

	onMount(() => {
		if (browser) {
			window.onscroll = onscroll;
		}
	});
</script>

<div />
