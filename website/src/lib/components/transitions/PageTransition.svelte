<script lang="ts">
	import { fade } from 'svelte/transition';
	export let url = '';
	const pageTransitionDuration = 100;
	const pageDelay = pageTransitionDuration + 50;
</script>

{#key url}
	<main
		class="grow shrink-0 overflow-auto"
		in:fade={{ duration: pageTransitionDuration, delay: pageDelay }}
		out:fade={{ duration: pageTransitionDuration }}
	>
		<slot />
	</main>
{/key}
