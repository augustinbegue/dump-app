<script lang="ts">
	import ButtonImagePicker from '$lib/components/ui/inputs/ButtonImagePicker.svelte';
	import { currentUser, firebaseUser } from '$lib/modules/firebase/client';
	import type { User } from '@prisma/client';
	import { onMount } from 'svelte';

	const defaultProfileImage = '/images/default-user-photo.png';
	export let user: User;
	let photoUrl: string;

	let file: File;
	let dataUrl: string;

	function onProfilePictureChange(rFile: File) {
		dataUrl = dataUrl;
		file = rFile;
	}

	let resetLoading = false;
	async function reset() {
		resetLoading = true;
		user = (await (await fetch(`/api/user/me`)).json()).user;
		resetLoading = false;
	}

	let usernameError = '';
	let saveLoading = false;
	async function save() {
		saveLoading = true;

		if (dataUrl && dataUrl != defaultProfileImage) {
			const data = {
				dataUrl: dataUrl
			};
			await fetch(`/api/user/me/profile-picture`, {
				method: 'POST',
				body: JSON.stringify(data)
			});
		} else if (dataUrl === defaultProfileImage) {
			user.photoUrl = defaultProfileImage;
		}

		let res = await fetch(`/api/user/me`, {
			method: 'POST',
			body: JSON.stringify({
				...user
			})
		});

		if (res.status != 200) {
			usernameError = 'Username already taken';
		} else {
			usernameError = '';
			currentUser.set((await res.json()).user);
		}

		saveLoading = false;
	}

	onMount(() => {
		photoUrl = user.photoUrl;
	});
</script>

<div class="form-control">
	<label for="profile-picture" class="label">
		<span class="label-text">profile picture</span>
	</label>
	<div class="avatar items-center">
		<div class="w-24 rounded-full">
			<img src={dataUrl ?? photoUrl} alt={user.username} />
		</div>
	</div>
	<div class="btn-group mt-2">
		<ButtonImagePicker bind:file bind:dataUrl onchange={onProfilePictureChange} text={'edit'} />
		<button
			class="btn btn-sm btn-error btn-outline"
			on:click={() => {
				dataUrl = defaultProfileImage;
			}}>Delete</button
		>
	</div>
</div>
<div class="form-control w-1/2">
	<label class="label" for="username">
		<span class="label-text">username</span>
	</label>
	<input
		class="input input-bordered"
		type="text"
		name="username"
		bind:value={user.username}
		class:input-error={usernameError}
	/>
	{#if usernameError}
		<label class="label" for="username">
			<span class="label-text-alt text-error">{usernameError}</span>
		</label>
	{/if}
</div>
<div class="form-control w-1/2">
	<label class="label" for="name">
		<span class="label-text">name</span>
	</label>
	<input class="input input-bordered" type="text" name="name" bind:value={user.name} />
</div>
<div class="form-control my-4  w-1/2">
	<div class="btn-group">
		<button
			class="btn btn-success"
			on:click={save}
			disabled={saveLoading}
			class:loading={saveLoading}>Save</button
		>
		<button
			class="btn btn-outline btn-primary"
			on:click={reset}
			disabled={resetLoading}
			class:loading={resetLoading}
		>
			Reset
		</button>
	</div>
</div>
