<script lang="ts">
	import { goto } from '$app/navigation';

	import ImagePicker from '$lib/components/inputs/ImagePickerDragAndDrop.svelte';
	import type { UploadImageInput } from '$lib/types/api';
	import { Steps } from '$lib/modules/interaction/steps';
	import { onMount } from 'svelte';

	let stepsContainer: HTMLElement;
	let sectionsContainer: HTMLElement;
	let steps: Steps;
	let nextDisabled = false;
	let previousDisabled = true;
	let uploadDisabled = true;
	let uploadError: string;
	function updateButtonsState(currentStep: number) {
		if (currentStep === 1) {
			previousDisabled = true;
		} else {
			previousDisabled = false;
		}

		if (currentStep === steps.steps.length) {
			nextDisabled = true;
		} else {
			if (currentStep === 1 && !file) nextDisabled = true;
			else nextDisabled = false;
		}
	}

	let file: File;
	let dataUrl: string;
	function onfilechange(file: File) {
		steps.currentStep.update((currentStep) => {
			updateButtonsState(currentStep);
			return currentStep;
		});

		if (!file) uploadDisabled = true;
		else {
			// Check that the file is an image
			if (file.type.indexOf('image') === -1) {
				uploadError = 'Please select a picture to upload.';
				uploadDisabled = true;
				return;
			} else {
				uploadError = '';
				uploadDisabled = false;
			}
		}
	}

	let title: string = '';
	let description: string = '';

	let metatype: string[] = [
		'location',
		'camera',
		'lens',
		'focal-length',
		'aperture',
		'shutter-speed',
		'iso'
	];
	function addMetatype() {
		metadata = metadata.set(selectedMetatype, '');
	}
	let metadata: Map<string, string> = new Map();
	$: notAddedMetatypes = metatype.filter((metatype) => !metadata.has(metatype));
	$: selectedMetatype = notAddedMetatypes[0];

	let uploading = false;
	let pid: string;
	async function upload() {
		const body = {
			title,
			description,
			metadataKeys: Array.from(metadata.keys()),
			metadataValues: Array.from(metadata.values())
		};

		try {
			uploading = true;
			let res = await fetch('/api/posts/new', {
				method: 'POST',
				body: JSON.stringify(body)
			});

			if (res.status === 200) {
				let json = await res.json();

				pid = json.post.pid;
				let input: UploadImageInput = {
					dataUrl,
					pid
				};
				res = await fetch('/upload', {
					method: 'POST',
					body: JSON.stringify(input)
				});

				if (res.status === 200) {
					goto(`/posts/${json.post.pid}`);
				} else {
					throw new Error('File Upload failed');
				}
			}

			uploadError =
				'An error occurred while uploading your image. Please try again or contact us if the problem persists.';
			uploading = false;
		} catch (error) {
			uploading = false;
			uploadError =
				'An error occurred while uploading your image. Please try again or contact us if the problem persists.';

			if (pid) {
				await fetch(`/api/posts/${pid}`, {
					method: 'DELETE',
					body: JSON.stringify(body)
				});
			}
		}
	}

	onMount(() => {
		steps = new Steps(stepsContainer, sectionsContainer);
		steps.currentStep.subscribe((currentStep) => {
			updateButtonsState(currentStep);
		});
	});
</script>

<div class="h-full flex flex-col justify-start items-center px-2">
	<ul bind:this={stepsContainer} class="steps w-full p-4 sticky">
		<li class="step step-primary">Choose an image</li>
		<li class="step">Add a title and a description</li>
		<li class="step">Add metadata</li>
		<li class="step">Upload</li>
	</ul>

	<div bind:this={sectionsContainer} class="w-full shrink-0 grow">
		<section>
			<ImagePicker bind:file bind:dataUrl onchange={onfilechange} />
		</section>
		<section class="hidden">
			<div class="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
				<div class="card-body">
					<div class="form-control">
						<label class="label" for="title">
							<span class="label-text">Title</span>
						</label>
						<input
							bind:value={title}
							id="title"
							type="text"
							placeholder="Title"
							class="input input-bordered"
						/>
					</div>
					<div class="form-control">
						<label class="label" for="description">
							<span class="label-text">Description</span>
						</label>
						<textarea
							class="textarea textarea-bordered"
							placeholder="Description"
							bind:value={description}
						/>
					</div>
				</div>
			</div>
		</section>
		<section class="hidden">
			<div class="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
				<div class="card-body ">
					{#each Array.from(metadata.keys()) as key}
						<div class="form-control ">
							<div class="input-group">
								<span>{key}</span>
								<input
									value={metadata.get(key)}
									on:change={(e) => {
										metadata = metadata.set(key, e.currentTarget.value);
									}}
									id={key}
									type="text"
									placeholder={key}
									class="input input-bordered"
								/>
							</div>
						</div>
					{/each}
					<div class="form-control ">
						{#if notAddedMetatypes.length > 0}
							<div class="input-group ">
								<select class="select select-bordered" bind:value={selectedMetatype}>
									{#each notAddedMetatypes as metatype}
										<option>{metatype}</option>
									{/each}
								</select>
								<button class="btn" on:click={addMetatype}>Add</button>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</section>
		<section class="hidden">
			<div class="card flex-shrink-0 w-full max-w-5xl shadow-2xl bg-base-300 m-4">
				<div class="hero bg-base-300 p-4">
					<div class="hero-content flex-col lg:flex-row">
						{#if dataUrl}
							<img src={dataUrl} class="md:max-w-sm shadow-2xl" alt="to be uploaded" />
						{/if}
						<div>
							<h1 class="text-5xl font-bold overflow-ellipsis break-all">{title}</h1>
							<p class="py-6 break-all">
								{description}
							</p>
							{#each Array.from(metadata.keys()) as key}
								<p>{key}: {metadata.get(key)}</p>
							{/each}
						</div>
					</div>
				</div>
				<div class="card-body">
					<button
						class="btn btn-primary"
						name="upload"
						on:click={upload}
						disabled={uploading || uploadDisabled}
						class:loading={uploading}
					>
						Post
					</button>
					{#if uploadError}
						<label class="label" for="upload">
							<span class="label-text-alt text-red-600">{uploadError}</span>
						</label>
					{/if}
				</div>
			</div>
		</section>
	</div>

	<div class="w-full m-4">
		<div class="mx-auto px-4 w-full max-w-5xl flex flex-row justify-between">
			<button class="btn" on:click={() => steps.prevStep()} disabled={previousDisabled}>
				Back
			</button>
			<button class="btn btn-primary" on:click={() => steps.nextStep()} disabled={nextDisabled}>
				Continue
			</button>
		</div>
	</div>
</div>

<style lang="postcss">
	section {
		@apply flex flex-col justify-start items-center w-full;
	}
</style>
