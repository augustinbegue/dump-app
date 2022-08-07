<script lang="ts">
	import { onMount } from 'svelte';

	export let text: string;
	export let file: File;
	export let dataUrl: string;
	export let onchange: (file: File) => void;
	let button: HTMLElement;

	onMount(() => {
		const getFileDataUrl = (file: File): Promise<string> => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => {
					resolve(reader.result as string);
				};
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
		};

		const setFile = async (inputFile: File) => {
			file = inputFile;
			dataUrl = await getFileDataUrl(file);
			onchange?.(file);
		};

		button.onclick = () => {
			let actualInput = document.createElement('input');
			actualInput.setAttribute('type', 'file');

			actualInput.onchange = async () => {
				if (actualInput.files && actualInput.files.length > 0) {
					setFile(actualInput.files[0]);
				}
				actualInput.remove();
			};

			actualInput.click();
		};
	});
</script>

<button bind:this={button} class="btn btn-sm">{text}</button>
