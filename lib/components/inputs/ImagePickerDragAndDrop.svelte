<script lang="ts">
	import { onMount } from 'svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	let fileInput: HTMLDivElement;
	export let file: File;
	export let dataUrl: string;
	export let onchange: (file: File) => void;
	let loading = false;
	$: validFile = file?.type.startsWith('image/');

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
			loading = true;
			file = inputFile;
			dataUrl = await getFileDataUrl(file);
			loading = false;
			onchange?.(file);
		};

		fileInput.onmouseenter = () => {
			if (!loading) {
				if (!file) (fileInput.childNodes[0] as HTMLElement).style.opacity = '1';
				else {
					(fileInput.childNodes[2] as HTMLElement).style.opacity = '1';
				}
			}
		};

		fileInput.onmouseleave = () => {
			if (!loading) {
				if (!file) (fileInput.childNodes[0] as HTMLElement).style.opacity = '0.5';
				else {
					(fileInput.childNodes[2] as HTMLElement).style.opacity = '0';
				}
			}
		};

		const preventDefault = (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
		};
		fileInput.ondrag = preventDefault;
		fileInput.ondragstart = preventDefault;
		fileInput.ondragend = preventDefault;
		fileInput.ondragover = preventDefault;
		fileInput.ondragenter = fileInput.onmouseenter;
		fileInput.ondragleave = fileInput.onmouseleave;

		fileInput.ondrop = (e: DragEvent) => {
			preventDefault(e);
			if (e.dataTransfer && e.dataTransfer.files.length > 0) setFile(e.dataTransfer.files[0]);
		};

		fileInput.onclick = () => {
			if (loading) return;

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

<div
	bind:this={fileInput}
	class="card bg-base-100 shadow-2xl h-full w-full max-w-5xl m-8 cursor-pointer max-h-[70vh]"
	class:image-full={validFile}
	class:cursor-pointer={!loading}
>
	{#if loading}
		<div class="card-body bg-base-100 items-center opacity-100 py-40 transition-all">
			<Spinner />
		</div>
	{:else if !validFile}
		<div class="card-body items-center opacity-50 py-40 transition-all">
			<span class="text-6xl">
				<span class="material-icons-outlined"> file_upload </span>
			</span>
			<h1 class="text-xl">
				<span class="font-bold">Choose a file</span>
				or drag it here
			</h1>
		</div>
	{:else if dataUrl}
		<figure class="p-4">
			<img class="card-img max-h-[70vh]" src={dataUrl} alt="uploaded file" />
		</figure>
		<div class="card-body items-center justify-center opacity-100 transition-all">
			<span class="text-6xl">
				<span class="material-icons-outlined"> file_upload </span>
			</span>
			<h1 class="text-xl">
				<span class="font-bold">Choose a file</span>
				or drag it here
			</h1>
		</div>
	{/if}
</div>

<style>
	.card.image-full:before {
		@apply transition-all;
		opacity: 0;
	}

	.card.image-full:hover:before {
		opacity: 0.5;
	}
</style>
