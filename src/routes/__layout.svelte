<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	/** @type {import('@sveltejs/kit').Load} */
	export const load: Load = async ({ url }) => ({ props: { url } });
</script>

<script lang="ts">
	import Footer from '$lib/components/footer/Footer.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import '../app.css';
	import PageTransition from '$lib/components/ui/transitions/PageTransition.svelte';

	export let url: string;
</script>

<svelte:head>
	<script defer src="../../node_modules/@fortawesome/fontawesome-free/js/all.min.js"></script>
</svelte:head>

<div class="flex flex-col justify-between h-full">
	<Header />

	<PageTransition {url}>
		<slot />
	</PageTransition>

	<Footer />
</div>

<style>
</style>
