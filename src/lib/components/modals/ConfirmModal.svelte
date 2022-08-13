<script lang="ts">
	import Modal from './Modal.svelte';

	export let title = 'Are you sure?';
	export let body = 'This action cannot be undone.';
	export let confirmText = 'Confirm';
	export let cancelText = 'Cancel';

	let modal: Modal;
	let confirm: () => void;
	let cancel: () => void;
	export function open() {
		modal.open();
		return new Promise<void>((resolve, reject) => {
			confirm = () => {
				modal.close();
				resolve();
			};

			cancel = () => {
				modal.close();
				reject();
			};
		});
	}
</script>

<Modal bind:this={modal}>
	<div class="card">
		<div class="card-body">
			<div class="card-title">
				<h2>{title}</h2>
			</div>
			<p>{body}</p>

			<div class="card-actions">
				<button on:click={() => confirm()} class="btn btn-primary">{confirmText}</button>
				<button on:click={() => cancel()} class="btn btn-secondary">{cancelText}</button>
			</div>
		</div>
	</div>
</Modal>
