<script lang="ts">
	import { goto } from '$app/navigation';

	import MultipleImagePickerDragAndDrop from '$lib/components/inputs/MultipleImagePickerDragAndDrop.svelte';
	import UserSearchBar from '$lib/components/inputs/UserSearchBar.svelte';
	import UserDisplay from '$lib/components/users/UserDisplay.svelte';
	import UserDisplaySmall from '$lib/components/users/UserDisplaySmall.svelte';
	import { currentUser } from '$lib/modules/firebase/client';
	import { Steps } from '$lib/modules/interaction/steps';
	import { createPost } from '$lib/modules/requests/createPost';
	import type {
		CollectionOutput,
		CreateOrUpdateCollectionInput,
		CreateOrUpdatePostInput,
		PostOutput,
		UploadImageInput
	} from '$lib/types/api';
	import type { PrivacySetting, User } from '@prisma/client';
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
			else if (currentStep === 2 && files.length === 0) nextDisabled = true;
			else if (currentStep === 3 && !privacy) nextDisabled = true;
			else nextDisabled = false;
		}

		if (!title || !description || files.length === 0 || !privacy) {
			uploadDisabled = true;
		} else {
			uploadDisabled = false;
		}
	}

	// Step 1
	let title = '';
	$: title, updateButtonsState(currentStep);
	let description = '';
	$: description, updateButtonsState(currentStep);

	// Step 2
	let files: File[] = [];
	let dataUrls: string[] = [];
	function onfileschange(files: File[]) {
		updateButtonsState(currentStep);
	}

	// Step 3
	let privacy: PrivacySetting = 'PUBLIC';
	$: privacy, updateButtonsState(currentStep);
	let allowedUids: string[] = [];
	let allowedUsers: User[] = [];
	$: allowedUids,
		updateButtonsState(currentStep),
		(async () => {
			for (let i = 0; i < allowedUids.length; i++) {
				const uid = allowedUids[i];

				let user: User | undefined = allowedUsers.find((u) => u.uid === uid);
				if (user) {
					allowedUsers[i] = user;
				} else {
					const res = await fetch(`/api/users/${uid}`);
					allowedUsers[i] = (await res.json()).user;
				}
			}
		})();

	let uploading = false;
	async function upload() {
		if (uploading) return;

		const body: CreateOrUpdateCollectionInput = {
			name: title,
			description: description,
			privacy: privacy,
			allowedUids: allowedUids
		};

		try {
			uploading = true;
			let res = await fetch('/api/collections/new', {
				method: 'POST',
				body: JSON.stringify(body)
			});

			if (res.status === 200) {
				let data = (await res.json()) as CollectionOutput;

				let collectionId = data.collection.cid;

				// Create hidden posts for each file in the collection
				let promises = [];
				for (let i = 0; i < dataUrls.length; i++) {
					const body: CreateOrUpdatePostInput = {
						collectionCid: collectionId,
						metadataKeys: [],
						metadataValues: [],
						title: files[i].name,
						description: '',
						showInFeed: false
					};

					promises.push(createPost(body, dataUrls[i]));
				}

				await Promise.all(promises);

				goto(`/collections/${collectionId}`);
			} else {
				uploadError =
					'An error occurred while creating the collection. Please try again or contact us if the problem persists.';
			}
			uploading = false;
		} catch (error) {
			uploading = false;
			console.error(error);
			uploadError =
				'An error occurred while creating the collection. Please try again or contact us if the problem persists.';
		}
	}

	onMount(() => {
		steps = new Steps(stepsContainer, sectionsContainer);
		steps.currentStep.subscribe((cs) => {
			currentStep = cs;
			updateButtonsState(cs);
		});
	});
</script>

<div class="h-full flex flex-col justify-start items-center px-2">
	<ul bind:this={stepsContainer} class="steps w-full p-4 sticky">
		<li class="step step-primary">choose a title and description</li>
		<li class="step">add new or existing photos</li>
		<li class="step">set access settings</li>
		<li class="step">submit</li>
	</ul>

	<div bind:this={sectionsContainer} class="w-full shrink-0 grow">
		<section>
			<div class="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
				<div class="card-body">
					<div class="form-control">
						<label class="label" for="title">
							<span class="label-text">name*</span>
						</label>
						<input
							bind:value={title}
							id="title"
							type="text"
							placeholder="name"
							class="input input-bordered"
							required
						/>
					</div>
					<div class="form-control">
						<label class="label" for="description">
							<span class="label-text">description*</span>
						</label>
						<textarea
							class="textarea textarea-bordered"
							placeholder="description"
							bind:value={description}
							required
						/>
					</div>
				</div>
			</div>
		</section>
		<section class="display: none;">
			<MultipleImagePickerDragAndDrop bind:files bind:dataUrls onchange={onfileschange} />
		</section>
		<section class="display: none;">
			<div class="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100 h-full">
				<div class="card-body">
					<div class="form-control">
						<label class="label" for="privacy">
							<span class="label-text">privacy*</span>
						</label>
						<select name="privacy" bind:value={privacy} class="select select-bordered">
							<option value="PUBLIC">public</option>
							<option value="PRIVATE">private</option>
						</select>
					</div>
					{#if privacy === 'PRIVATE'}
						<div class="form-control mb-10">
							<label class="label" for="">
								<span class="label-text">allowed users</span>
							</label>
							<UserSearchBar
								onclick={(user) => {
									if (allowedUids.includes(user.uid)) {
										return;
									}

									allowedUids = [...allowedUids, user.uid];
								}}
								closeOnSelect={true}
							/>
							<label class="label" for="">
								<span class="label-text-alt">
									selected users will be, apart from you, the only able to access the collection
								</span>
							</label>
						</div>
						<div class="flex flex-col gap-2">
							{#each allowedUsers as user, i}
								{#key user.uid}
									<div
										on:click={() => {
											allowedUids = allowedUids.filter((uid) => uid !== user.uid);
										}}
										class="flex flex-row justify-between items-center"
									>
										<UserDisplaySmall bind:user />
										<button
											class="link link-hover"
											on:click={() => {
												allowedUids = allowedUids.filter((uid) => uid !== user.uid);
											}}
										>
											remove
										</button>
									</div>
								{/key}
								{#if i < allowedUsers.length - 1}
									<div class="divider my-2" />
								{/if}
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</section>
		<section class="display: none;">
			<div class="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
				<div class="card-body">
					<div class="card-title">recap</div>
					<h2 class="text-lg font-medium">basic info</h2>
					<p><span class="kbd font-medium">name: </span>{title}</p>
					<p><span class="kbd font-medium">description: </span>{description}</p>
					<h2 class="text-lg font-medium">images</h2>
					<p>
						{#if files.length > 0}
							{#each files as file, i}
								<span class="kbd font-medium m-1">{file.name}</span>
							{/each}
						{:else}
							<span class="label-text-alt">no images yet, you can always add some later.</span>
						{/if}
					</p>
					<h2 class="text-lg font-medium">privacy</h2>
					<p>
						{#if privacy === 'PUBLIC'}
							<span class="kbd font-medium">public</span>
						{:else}
							<span class="kbd font-medium">private</span> {allowedUsers.length} allowed users
						{/if}
					</p>
					<div class="card-actions">
						<button
							class="btn btn-primary"
							name="upload"
							on:click={upload}
							disabled={uploading || uploadDisabled}
							class:loading={uploading}
						>
							Create
						</button>
						{#if uploadError}
							<label class="label" for="upload">
								<span class="label-text-alt text-red-600">{uploadError}</span>
							</label>
						{/if}
					</div>
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
	.hidden {
		display: none !important;
	}

	section {
		@apply flex flex-col justify-start items-center w-full;
	}
</style>
