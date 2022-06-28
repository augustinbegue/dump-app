<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<p><a href="https://begue.cc">Augustin BÉGUÉ</a></p>
</footer>

<style>
</style>
