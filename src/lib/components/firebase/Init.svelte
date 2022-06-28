<script lang="ts">
	import { onMount } from 'svelte';
	import { getApps, initializeApp } from 'firebase/app';

	onMount(() => {
		if (!getApps().length) {
			// TODO: Add firebase configuration
			initializeApp({});
		}
	});
</script>
