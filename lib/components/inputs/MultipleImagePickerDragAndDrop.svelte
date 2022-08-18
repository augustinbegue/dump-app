<script lang="ts">
	import Spinner from '$lib/components/Spinner.svelte';

	let fileInput: HTMLDivElement;
	export let files: File[] = [];
	export let dataUrls: string[] = [];
	export let onchange: ((files: File[]) => void) | undefined;
	let loading = false;
	$: validFiles = files?.length > 0 ? files.every((f) => f.type.startsWith('image/')) : false;
	$: validFiles, console.log(validFiles);

	let removeImage: (index: number) => void;

	$: fileInput, init();
	async function init() {
		if (!fileInput) return;

		removeImage = (index: number) => {
			files.splice(index, 1);
			files = files.slice();
			dataUrls.splice(index, 1);
			dataUrls = dataUrls.slice();

			onchange?.(files);
		};

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
			dataUrls = [...dataUrls, await getFileDataUrl(inputFile)];
			files = [...files, inputFile];
			onchange?.(files);
		};

		fileInput.onmouseenter = () => {
			if (!loading) {
				if (!validFiles) (fileInput.childNodes[0] as HTMLElement).style.opacity = '1';
			}
		};

		fileInput.onmouseleave = () => {
			if (!loading) {
				if (!validFiles) (fileInput.childNodes[0] as HTMLElement).style.opacity = '0.5';
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

		fileInput.ondrop = async (e: DragEvent) => {
			preventDefault(e);
			if (e.dataTransfer && e.dataTransfer.files.length > 0) {
				loading = true;

				for (let i = 0; i < e.dataTransfer.files.length; i++) {
					const file = e.dataTransfer.files[i];
					await setFile(file);
				}
				loading = false;
			}
		};

		fileInput.onclick = () => {
			if (loading) return;

			let actualInput = document.createElement('input');
			actualInput.setAttribute('type', 'file');
			actualInput.setAttribute('multiple', 'multiple');
			actualInput.setAttribute('accept', 'image/*');

			actualInput.onchange = async () => {
				if (actualInput.files && actualInput.files.length > 0) {
					loading = true;
					for (let i = 0; i < actualInput.files.length; i++) {
						const file = actualInput.files[i];
						await setFile(file);
					}
					loading = false;
				}
				actualInput.remove();
			};

			actualInput.click();
		};
	}
</script>

{#if !validFiles || loading}
	<div
		bind:this={fileInput}
		class="card bg-base-100 shadow-2xl h-full w-full m-8 max-h-[70vh]"
		class:cursor-pointer={!loading && !validFiles}
	>
		{#if loading}
			<div class="card-body bg-base-100 items-center opacity-100 py-40 transition-all">
				<Spinner />
			</div>
		{:else}
			<div class="card-body items-center opacity-50 py-40 transition-all">
				<span class="text-6xl">
					<span class="material-icons-outlined"> file_upload </span>
				</span>
				<h1 class="text-xl">
					<span class="font-bold">Choose files</span>
					or drag them here
				</h1>
			</div>
		{/if}
	</div>
{:else if validFiles}
	<div class="card bg-base-100 shadow-2xl h-full w-full max-w-5xl m-8 max-h-[70vh]">
		<div class="grid grid-flow-row grid-cols-3 gap-4 overflow-y-scroll p-2">
			{#if dataUrls.length > 0}
				{#each dataUrls as dataUrl, i}
					<div class="h-full flex-col items-center justify-between">
						<img src={dataUrl} alt="i" />
						<div class="kbd inline-flex justify-between w-full border-t-0">
							<p>{files[i].name}</p>
							<button class="link link-hover" on:click={() => removeImage(i)}>remove</button>
						</div>
					</div>
				{/each}
			{/if}
			<div
				class="flex flex-col items-center justify-center h-full border-4 border-base-200 border-solid cursor-pointer py-8"
				bind:this={fileInput}
			>
				<span class="text-6xl">
					<span class="material-icons-outlined"> file_upload </span>
				</span>
				<h1 class="text-xl">
					<span class="font-bold">Add other files</span>
				</h1>
				<h1 class="text-xl">or drag them here</h1>
			</div>
		</div>
	</div>
{/if}
