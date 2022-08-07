<script lang="ts">
	import Footer from '$lib/components/footer/Footer.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import { firebaseUser } from '$lib/modules/firebase/client';
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(async () => {
		const { fetch: originalFetch } = window;
		window.fetch = async function (url, options) {
			console.log('fetching', url);

			if ($firebaseUser)
				document.cookie = `authorization=Bearer ${await $firebaseUser.getIdToken()}; Path=/;`;
			else document.cookie = `authorization=; Path=/; Expires=${new Date(0).toUTCString()};`;

			return originalFetch(url, options);
		};
	});
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
