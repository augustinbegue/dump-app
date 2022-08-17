<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';

	import MultipleImagePickerDragAndDrop from '$lib/components/inputs/MultipleImagePickerDragAndDrop.svelte';
	import { createPost } from '$lib/modules/requests/createPost';
	import type { CreateOrUpdatePostInput } from '$lib/types/api';

	let files: File[] = [];
	let dataUrls: string[] = [];
	function onfileschange(files: File[]) {}

	let uploading = false;
	let uploadError = '';
	async function upload() {
		if (uploading) return;

		try {
			uploading = true;

			let collectionId = $page.params.cid;

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
			uploading = false;
			goto(`/collections/${collectionId}`);
		} catch (error) {
			uploading = false;
			console.error(error);
			uploadError =
				'An error occurred while creating the collection. Please try again or contact us if the problem persists.';
		}
	}
</script>

<section class="container mx-auto">
	<MultipleImagePickerDragAndDrop bind:files bind:dataUrls onchange={onfileschange} />
	<div class="btn-group">
		<button
			class="btn btn-primary"
			on:click={async () => {
				await upload();
			}}
			class:loading={uploading}
			disabled={uploading}
		>
			save
		</button>
		<button
			class="btn btn-ghost"
			disabled={uploading}
			on:click={() => {
				window.history.back();
			}}
		>
			cancel
		</button>
	</div>
</section>
