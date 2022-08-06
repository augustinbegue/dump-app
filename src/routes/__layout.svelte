<script lang="ts">
	import Footer from '$lib/components/footer/Footer.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import '../app.css';
</script>

<svelte:head>
	<script defer src="../../node_modules/@fortawesome/fontawesome-free/js/all.min.js"></script>
</svelte:head>

<div class="flex flex-col justify-between h-full">
	<Header />

	<main class="grow shrink-0 overflow-auto">
		<slot />
	</main>

	<Footer />
</div>

<style>
</style>
