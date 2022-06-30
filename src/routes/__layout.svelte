<script lang="ts">
	import Footer from '$lib/components/footer/Footer.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import '../app.css';
</script>

<svelte:head>
	<script defer src="../../node_modules/@fortawesome/fontawesome-free/js/all.min.js"></script>
</svelte:head>

<Header />

<main>
	<slot />
</main>

<Footer />

<style>
</style>
