<script lang="ts">
	import { dev } from '$app/env';

	import Alerter from '$lib/components/Alerter.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import { firebaseUser } from '$lib/modules/firebase/client';
	import { onMount } from 'svelte';
	import '../app.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	onMount(async () => {
		const { fetch: windowFetch } = window;
		window.fetch = async function (url, options) {
			if (url.toString().startsWith('/api'))
				if ($firebaseUser)
					document.cookie = `authorization=Bearer ${await $firebaseUser.getIdToken()}; Path=/;`;
				else document.cookie = `authorization=; Path=/; Expires=${new Date(0).toUTCString()};`;

			if (url.toString().startsWith('/upload')) {
				options = {
					...options,
					headers: {
						...options?.headers,
						authorization: document.cookie.replace(/^.*authorization=([^;]*).*$/, '$1')
					}
				};
				if (dev) {
					url = url.toString().replace('/upload', 'http://127.0.0.1:4174/upload');
				} else {
					url = url.toString().replace('/upload', 'https://dump-app.begue.cc/upload');
				}
			}

			return windowFetch(url, options);
		};
	});
</script>

<Alerter />
<div class="flex flex-col justify-between h-full">
	<Header />

	<main class="grow shrink-0 overflow-auto">
		<slot />
	</main>

	<Footer url={data.url} />
</div>

<style>
</style>
