<script lang="ts">
	import { goto } from '$app/navigation';

	import ImagePicker from '$lib/components/inputs/ImagePickerDragAndDrop.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { currentUser } from '$lib/modules/firebase/client';
	import { Steps } from '$lib/modules/interaction/steps';
	import { onMount } from 'svelte';

	let stepsContainer: HTMLElement;
	let sectionsContainer: HTMLElement;
	let steps: Steps;
	let currentStep = 1;
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

		if (currentStep === steps?.steps.length) {
			nextDisabled = true;
		} else {
			if (currentStep === 1 && (!title || !description)) nextDisabled = true;
			else nextDisabled = false;
		}
	}

	let title: string = '';
	$: title, updateButtonsState(currentStep);
	let description: string = '';
	$: description, updateButtonsState(currentStep);

	let uploading = false;
	async function upload() {
		const body = {
			title,
			description
		};

		try {
			uploading = true;
			let res = await fetch('/api/collections/new', {
				method: 'POST',
				body: JSON.stringify(body)
			});

			if (res.status === 200) {
				let json = await res.json();
				if (json.success) {
					goto(`/${$currentUser?.username}/posts/${json.post.pid}`);
				} else {
					uploadError = json.error;
				}
			} else {
				uploadError =
					'An error occurred while uploading your image. Please try again or contact us if the problem persists.';
			}
			uploading = false;
		} catch (error) {
			uploading = false;
			console.error(error);
			uploadError =
				'An error occurred while uploading your image. Please try again or contact us if the problem persists.';
		}
	}

	onMount(() => {
		steps = new Steps(stepsContainer, sectionsContainer, 2);
		steps.currentStep.subscribe((cs) => {
			currentStep = cs;
			updateButtonsState(cs);
		});
	});
</script>

<div class="h-full flex flex-col justify-start items-center px-2">
	<ul bind:this={stepsContainer} class="steps w-full p-4 sticky">
		<li class="step step-primary">Choose a title and description</li>
		<li class="step">Add new or existing photos</li>
		<li class="step">Set access settigns</li>
		<li class="step">Submit</li>
	</ul>

	<div bind:this={sectionsContainer} class="w-full shrink-0 grow">
		<section>
			<div class="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
				<div class="card-body">
					<div class="form-control">
						<label class="label" for="title">
							<span class="label-text">Title*</span>
						</label>
						<input
							bind:value={title}
							id="title"
							type="text"
							placeholder="Title"
							class="input input-bordered"
							required
						/>
					</div>
					<div class="form-control">
						<label class="label" for="description">
							<span class="label-text">Description*</span>
						</label>
						<textarea
							class="textarea textarea-bordered"
							placeholder="Description"
							bind:value={description}
							required
						/>
					</div>
				</div>
			</div>
		</section>
		<section class="hidden">2</section>
		<section class="hidden">3</section>
		<section class="hidden">4</section>
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
