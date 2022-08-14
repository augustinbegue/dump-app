<script lang="ts">
	import { alerts } from '$lib/modules/interaction/alerter';

	import {
		faCheckCircle,
		faInfoCircle,
		faTimes,
		faTimesCircle,
		faWarning
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa/src/fa.svelte';
</script>

<div class="absolute bottom-0 p-4 w-full z-50">
	<div class=" container mx-auto">
		{#each $alerts as alert, i}
			<div
				class="alert shadow-lg m-2"
				class:alert-info={alert.type === 'info'}
				class:alert-success={alert.type === 'success'}
				class:alert-warning={alert.type === 'warning'}
				class:alert-error={alert.type === 'error'}
			>
				<div>
					{#if alert.type === 'info'}
						<Fa icon={faInfoCircle} />
					{/if}
					{#if alert.type === 'success'}
						<Fa icon={faCheckCircle} />
					{/if}
					{#if alert.type === 'warning'}
						<Fa icon={faWarning} />
					{/if}
					{#if alert.type === 'error'}
						<Fa icon={faTimesCircle} />
					{/if}
					<span>{@html alert.message}</span>
				</div>
				<div class="flex-none">
					<button
						class="btn btn-sm btn-ghost btn-primary"
						on:click={() => {
							alerts.update((alerts) => {
								return alerts.filter((a, j) => j !== i);
							});
						}}
					>
						<Fa icon={faTimes} />
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
