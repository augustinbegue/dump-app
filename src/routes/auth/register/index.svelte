<script lang="ts">
	import { goto } from '$app/navigation';
	import { firebaseUser } from '$lib/modules/firebase/client';
	import { auth, googleProvider } from '$lib/modules/firebase/client';
	import { FirebaseError } from 'firebase/app';
	import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
	import { onMount } from 'svelte';

	let email: string;
	let password: string;
	let passwordConfirm: string;

	let emailError: string;
	let passwordError: string;
	let emailPasswordLoading: boolean = false;
	async function registerWithEmailAndPassword(e: Event) {
		e.preventDefault();
		emailError = '';
		passwordError = '';

		if (!email) {
			emailError = 'Email is required';
			return;
		}

		if (!password) {
			passwordError = 'Password is required';
			return;
		}

		if (password !== passwordConfirm) {
			passwordError = 'Passwords do not match';
			return;
		}

		try {
			emailPasswordLoading = true;
			let credentials = await createUserWithEmailAndPassword(auth, email, password);
			return goto('./register/next');
		} catch (error) {
			emailPasswordLoading = false;
			if (error instanceof FirebaseError) {
				if (error.code === 'auth/email-already-in-use') {
					emailError = 'Email is already in use';
				} else if (error.code === 'auth/invalid-email') {
					emailError = 'Email is invalid';
				} else if (error.code === 'auth/weak-password') {
					passwordError = 'Password is too weak';
				} else {
					emailError = 'An unknown error occured';
					console.error(error);
				}
			}
		}
	}

	let googleLoading: boolean = false;
	async function registerWithGoogle() {
		try {
			googleLoading = true;
			let credentials = await signInWithPopup(auth, googleProvider);
			return goto('./register/next');
		} catch (error) {
			googleLoading = false;
			console.error(error);
		}
	}

	onMount(() => {
		firebaseUser.subscribe((user) => {
			if (user != null) {
				return goto('./register/next');
			}
		});

		emailError = '';
		passwordError = '';
		emailPasswordLoading = false;
		googleLoading = false;
	});
</script>

<svelte:head>
	<title>Register - Dump</title>
</svelte:head>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left lg:min-w-max">
			<h1 class="text-5xl font-bold">Register now!</h1>
			<p class="py-6">Provident cupiditate voluptatem et in.</p>
		</div>
		<div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
			<div class="card-body">
				<form on:submit={registerWithEmailAndPassword}>
					<div class="form-control">
						<label class="label" for="email">
							<span class="label-text">Email</span>
						</label>
						<input
							bind:value={email}
							id="email"
							type="email"
							placeholder="email"
							class="input input-bordered"
							autocomplete="email"
							class:input-error={emailError}
						/>
						{#if emailError}
							<label class="label" for="email">
								<span class="label-text-alt text-error">{emailError}</span>
							</label>
						{/if}
					</div>
					<div class="form-control">
						<label class="label" for="password">
							<span class="label-text">Password</span>
						</label>
						<input
							bind:value={password}
							id="password"
							type="password"
							placeholder="password"
							class="input input-bordered"
							class:input-error={passwordError}
						/>
						{#if passwordError}
							<label class="label" for="password">
								<span class="label-text-alt text-error">{passwordError}</span>
							</label>
						{/if}
					</div>
					<div class="form-control">
						<label class="label" for="passwordconfirm">
							<span class="label-text">Password Confirmation</span>
						</label>
						<input
							bind:value={passwordConfirm}
							id="passwordconfirm"
							type="password"
							placeholder="password"
							class="input input-bordered"
							class:input-error={passwordError}
						/>
						{#if passwordError}
							<label class="label" for="passwordconfirm">
								<span class="label-text-alt text-error">{passwordError}</span>
							</label>
						{/if}
					</div>
					<div class="form-control mt-6">
						<input
							type="submit"
							value="Next"
							class="btn btn-primary"
							class:loading={emailPasswordLoading}
							disabled={googleLoading}
						/>
					</div>
				</form>
				<div class="divider">OR</div>
				<div class="form-control">
					<button
						class="btn btn-secondary  gap-2"
						on:click={registerWithGoogle}
						class:loading={googleLoading}
						disabled={emailPasswordLoading}
					>
						<i class="fa-brands fa-google" />
						Sign in with Google
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
