<script lang="ts">
	import LoginModal from '$lib/components/ui/modals/LoginModal.svelte';
	import Login from '$lib/components/ui/modals/LoginModal.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { firebaseUser } from '$lib/modules/firebase/client';
	import type { User } from '@prisma/client';
	import { FirebaseError } from 'firebase/app';
	import { updateEmail, updatePassword, updatePhoneNumber } from 'firebase/auth';
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';

	let loginModal: LoginModal;
	let email: string;
	let phoneNumber: string;

	let resetLoading = false;
	async function onReset() {}

	let emailError = '';
	let saveLoading = false;
	async function onSave() {
		if (!$firebaseUser) return;

		try {
			if ($firebaseUser.email != email) {
				await updateEmail($firebaseUser, email);
			}
		} catch (error) {
			if (error instanceof FirebaseError) {
				if (error.code == 'auth/requires-recent-login') {
					let success = await loginModal.open();
					if (success) {
						console.log('success');

						await updateEmail($firebaseUser, email).catch(console.error);
					} else {
						emailError = 'You must login again to be able to update your email.';
					}
				}
			} else {
				emailError = error.message;
			}
		}

		// if ($firebaseUser.phoneNumber != phoneNumber) {
		// 	updatePhoneNumber($firebaseUser, phoneNumber);
		// }
	}

	let us: Unsubscriber;
	onMount(() => {
		us = firebaseUser.subscribe((user) => {
			if (!user) return;

			email = user.email ?? '';
			phoneNumber = user.phoneNumber ?? '';
		});
	});

	onDestroy(() => {
		if (us) us();
	});
</script>

<LoginModal bind:this={loginModal} />

<div class="form-control w-1/2">
	<label class="label" for="username">
		<span class="label-text">email</span>
	</label>
	<input
		class="input input-bordered"
		type="text"
		name="email"
		bind:value={email}
		class:input-error={emailError}
		disabled
	/>
	{#if emailError}
		<label class="label" for="username">
			<span class="label-text-alt text-red-500">{emailError}</span>
		</label>
	{/if}
</div>
<!-- <div class="form-control w-1/2">
		<label class="label" for="username">
			<span class="label-text">phone number</span>
		</label>
		<input class="input input-bordered" type="text" name="phoneNumber" bind:value={phoneNumber} />
	</div> -->
<div class="form-control my-4  w-1/2">
	<div class="btn-group">
		<button
			class="btn btn-success"
			disabled={saveLoading || !$firebaseUser}
			class:loading={saveLoading}
		>
			Save
		</button>
		<button
			class="btn btn-outline btn-primary"
			disabled={resetLoading}
			class:loading={resetLoading}
		>
			Reset
		</button>
	</div>
</div>
