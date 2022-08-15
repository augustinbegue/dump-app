<script lang="ts">
	import { alerts } from '$lib/modules/interaction/alerter';
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
						<span class="material-icons-outlined"> info </span>
					{/if}
					{#if alert.type === 'success'}
						<span class="material-icons-outlined"> check_circle </span>
					{/if}
					{#if alert.type === 'warning'}
						<span class="material-icons-outlined"> warning_amber </span>
					{/if}
					{#if alert.type === 'error'}
						<span class="material-icons-outlined"> error_outline </span>
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
						<span class="material-icons-outlined"> close </span>
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
