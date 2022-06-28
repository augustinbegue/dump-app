<script lang="ts">
	import FirebaseInit from '$lib/components/firebase/Init.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import '../app.css';
</script>

<FirebaseInit />

<Header />

<main>
	<slot />
</main>

<Footer />

<style>
</style>
