<script lang="ts">
	import LoginModal from '$lib/components/modals/LoginModal.svelte';
	import Login from '$lib/components/modals/LoginModal.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { firebaseUser } from '$lib/modules/firebase/client';
	import { addAlert, alerts } from '$lib/modules/interaction/alerter';
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
			await saveEmail();
		} catch (error) {
			return;
		}

		// if ($firebaseUser.phoneNumber != phoneNumber) {
		// 	updatePhoneNumber($firebaseUser, phoneNumber);
		// }

		emailError = '';
	}

	async function saveEmail() {
		if (!$firebaseUser) return;

		try {
			await updateEmail($firebaseUser, email);

			addAlert({
				type: 'success',
				message: 'Email updated successfully.'
			});
		} catch (error) {
			if (error instanceof FirebaseError) {
				if (error.code == 'auth/requires-recent-login') {
					let success = await loginModal.open();
					if (success) {
						saveEmail();
					} else {
						emailError = 'You must login again to be able to update your email.';
					}
				} else if (error.code == 'auth/email-already-in-use') {
					emailError = 'That email is already in use.';
				}
			} else {
				emailError = 'An error occurred while updating your email.';
			}
		}
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
			on:click={onSave}
		>
			Save
		</button>
		<button
			class="btn btn-outline btn-primary"
			disabled={resetLoading}
			class:loading={resetLoading}
			on:click={onReset}
		>
			Reset
		</button>
	</div>
</div>
