<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/modules/firebase/client';

	import type { Post, User } from '@prisma/client';
	import { onMount } from 'svelte';

	import type { PageData } from "./$types"

	export let data: PageData;
	$: ({ post } = data);

	$: isAuthor = post.author.uid === $currentUser?.uid;

	let metatype: string[] = [
		'location',
		'camera',
		'lens',
		'focal-length',
		'aperture',
		'shutter-speed',
		'iso'
	];
	$: selectedMetatype = notAddedMetatypes[0];
	let metadata: Map<string, string> = new Map();
	function addMetatype() {
		metadata = metadata.set(selectedMetatype, '');
	}
	$: notAddedMetatypes = metatype.filter((metatype) => !metadata.has(metatype));

	let loading = false;
	async function onsave() {
		if (loading) return;

		loading = true;

		try {
			post.metadataKeys = Array.from(metadata.keys());
			post.metadataValues = Array.from(metadata.values());

			let res = await fetch(`/api/posts/${post.pid}`, {
				method: 'POST',
				body: JSON.stringify(post)
			});

			if (res.status === 200) {
				goto(`/posts/${post.pid}`);
			} else {
				console.error(await res.json());
			}
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		if (!isAuthor) goto('.');

		metadata = new Map();
		for (let i = 0; i < post.metadataKeys.length; i++) {
			metadata.set(post.metadataKeys[i], post.metadataValues[i]);
		}
	});
</script>

<section class="container mx-auto">
	<div class="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
		<div class="card-body">
			<div class="card-title">
				<h1 class="text-2xl font-bold">edit post</h1>
			</div>
			<div class="card-title">
				<h2 class="text-xl font-bold">basic info</h2>
			</div>
			<div class="form-control">
				<label class="label" for="title">
					<span class="label-text">Title</span>
				</label>
				<input
					bind:value={post.title}
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
					bind:value={post.description}
				/>
			</div>
		</div>
	</div>
	<div class="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
		<div class="card-body">
			<div class="card-title">
				<h2 class="text-xl font-bold">metadata</h2>
			</div>
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
	<div class="card w-fit">
		<div class="card-body">
			<div class="btn-group">
				<button class="btn btn-primary" on:click={onsave} class:loading>save</button>
				<button
					class="btn btn-ghost"
					on:click={() => {
						window.history.back();
					}}
				>
					cancel
				</button>
			</div>
		</div>
	</div>
</section>
