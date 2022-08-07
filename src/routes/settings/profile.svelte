<script lang="ts">
	import ButtonImagePicker from '$lib/components/ui/inputs/ButtonImagePicker.svelte';
	import type { User } from '@prisma/client';

	const defaultProfileImage = '/images/default-user-photo.png';
	export let user: User;

	let file: File;
	let dataUrl: string;

	function onProfilePictureChange(rFile: File) {
		dataUrl = dataUrl;
		file = rFile;
	}

	let resetLoading = false;
	async function onReset() {
		resetLoading = true;
		user = (await (await fetch(`/api/user/me`)).json()).user;
		resetLoading = false;
	}

	let saveLoading = false;
	async function onSave() {
		saveLoading = true;

		user.photoUrl = defaultProfileImage;
		await fetch(`/api/user/me`, {
			method: 'POST',
			body: JSON.stringify({
				...user
			})
		});
		saveLoading = false;

		if (dataUrl && dataUrl != defaultProfileImage) {
			const data = {
				dataUrl: dataUrl
			};
			await fetch(`/api/user/me/profile-picture`, {
				method: 'POST',
				body: JSON.stringify(data)
			});
		} else {
			user.photoUrl = defaultProfileImage;
		}
	}
</script>

<div class="form-control">
	<label for="profile-picture" class="label">
		<span class="label-text">profile picture</span>
	</label>
	<div class="avatar items-center">
		<div class="w-24 rounded-full">
			<img src={dataUrl ?? user.photoUrl} alt={user.username} />
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
	<input class="input input-bordered" type="text" name="username" bind:value={user.username} />
</div>
<div class="form-control w-1/2">
	<label class="label" for="name">
		<span class="label-text">name</span>
	</label>
	<input class="input input-bordered" type="text" name="name" bind:value={user.name} />
</div>
<div class="form-control my-4  w-1/2">
	<div class="btn-group">
		<button class="btn btn-success" on:click={onSave} disabled={saveLoading}>Save</button>
		<button class="btn btn-outline btn-primary" on:click={onReset} disabled={resetLoading}>
			Reset
		</button>
	</div>
</div>
