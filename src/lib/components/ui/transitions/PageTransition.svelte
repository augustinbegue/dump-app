<script lang="ts">
	import { fade } from 'svelte/transition';
	export let url = '';
	const pageTransitionDuration = 100;
</script>

{#key url}
	<main
		class="grow shrink-0 overflow-auto"
		in:fade={{ duration: pageTransitionDuration, delay: pageTransitionDuration }}
		out:fade={{ duration: pageTransitionDuration }}
	>
		<slot />
	</main>
{/key}
