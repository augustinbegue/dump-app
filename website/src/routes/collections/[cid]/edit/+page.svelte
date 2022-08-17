<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import UserSearchBar from '$lib/components/inputs/UserSearchBar.svelte';
	import UserDisplaySmall from '$lib/components/users/UserDisplaySmall.svelte';
	import { currentUser } from '$lib/modules/firebase/client';
	import type { CollectionOutput, CreateOrUpdateCollectionInput } from '$lib/types/api';
	import type { PageData } from './$types'

	import type { User } from '@prisma/client';
	import { onMount } from 'svelte/internal';

	export let data: PageData;
	$: ({ collection } = data);

	$: isAuthor = collection.author.uid === $currentUser?.uid;

	let allowedUids: string[] = [];
	let allowedUsers: User[] = [];
	$: allowedUids,
		(async () => {
			if (!browser) return;
			let i = 0;
			for (; i < allowedUids.length; i++) {
				const uid = allowedUids[i];

				let user: User | undefined = allowedUsers.find((u) => u.uid === uid);
				if (user) {
					allowedUsers[i] = user;
				} else {
					const res = await fetch(`/api/users/${uid}`);
					allowedUsers[i] = (await res.json()).user;
				}
			}
			for (; i < allowedUsers.length; i++) {
				allowedUsers.pop();
			}
		})();

	let loading = false;
	async function onsave() {
		if (loading) return;
		loading = true;
		const body: CreateOrUpdateCollectionInput = {
			name: collection.name,
			description: collection.description,
			privacy: collection.privacy,
			allowedUids: allowedUids
		};

		console.log(body);

		const res = await fetch(`/api/collections/${collection.cid}`, {
			method: 'POST',
			body: JSON.stringify(body)
		});

		if (res.status === 200) {
			let data = (await res.json()) as CollectionOutput;

			collection = data.collection;

			goto(`/collections/${collection.cid}`);
		}
		loading = false;
	}

	onMount(() => {
		if (!isAuthor) goto('.');

		allowedUids = collection.allowedUsers.map(({ uid }) => uid);
	});
</script>

<section class="container mx-auto">
	<div class="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
		<div class="card-body">
			<div class="card-title">
				<h1 class="text-2xl font-bold">edit collection</h1>
			</div>
			<div class="card-title">
				<h2 class="text-xl font-bold">basic info</h2>
			</div>
			<div class="form-control">
				<label class="label" for="title">
					<span class="label-text">name*</span>
				</label>
				<input
					bind:value={collection.name}
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
					bind:value={collection.description}
					required
				/>
			</div>
		</div>
	</div>
	<div class="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100 h-full">
		<div class="card-body">
			<div class="card-title">
				<h2 class="text-xl font-bold">privacy settings</h2>
			</div>
			<div class="form-control">
				<label class="label" for="privacy">
					<span class="label-text">privacy*</span>
				</label>
				<select name="privacy" bind:value={collection.privacy} class="select select-bordered">
					<option value="PUBLIC">public</option>
					<option value="PRIVATE">private</option>
				</select>
			</div>
			{#if collection.privacy === 'PRIVATE'}
				<div class="form-control mb-10">
					<label class="label" for="">
						<span class="label-text">allowed users</span>
					</label>
					<UserSearchBar
						onclick={(user) => {
							console.log(user);

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
							<div class="flex flex-row justify-between items-center">
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
