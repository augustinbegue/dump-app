<script lang="ts">
	import {
		AuthCredential,
		EmailAuthProvider,
		GoogleAuthProvider,
		signInWithCredential,
		signInWithEmailAndPassword,
		signInWithPopup,
		type UserCredential
	} from 'firebase/auth';
	import { onMount } from 'svelte';
	import { auth, googleProvider } from '$lib/modules/firebase/client';
	import { FirebaseError } from 'firebase/app';

	let email: string;
	let password: string;
	let passwordError: string;
	let emailError: string;
	let emailPasswordLoading = false;
	async function loginWithEmailAndPassword(e: Event) {
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

		try {
			emailPasswordLoading = true;
			let authCredential = EmailAuthProvider.credential(email, password);
			let credential = await signInWithCredential(auth, authCredential);
			return (await userExists(credential))
				? onLogin('success', credential, authCredential)
				: onLogin('next');
		} catch (error) {
			emailPasswordLoading = false;
			if (error instanceof FirebaseError) {
				if (error.code === 'auth/users-not-found') {
					emailError = 'Email not found or password was incorrect';
					passwordError = 'Email not found or password was incorrect';
				} else if (error.code === 'auth/wrong-password') {
					emailError = 'Email not found or password was incorrect';
					passwordError = 'Email not found or password was incorrect';
				} else {
					emailError = 'An unknown error occured';
					console.error(error);
				}
			}
			return onLogin('failure');
		}
	}

	let googleLoading = false;
	async function registerWithGoogle() {
		try {
			googleLoading = true;
			let credential = await signInWithPopup(auth, googleProvider);
			let authCredential = GoogleAuthProvider.credentialFromResult(credential);

			console.log('user signed in', credential.user.email);

			return (await userExists(credential))
				? onLogin('success', credential, authCredential!)
				: onLogin('next');
		} catch (error) {
			googleLoading = false;
			console.error(error);
			return onLogin('failure');
		}
	}

	export let onLogin: (
		result: string,
		userCredential?: UserCredential,
		authCredential?: AuthCredential
	) => void;
	async function userExists(credential: UserCredential) {
		let user = credential.user;

		let res = await fetch(`/api/users/${user.uid}`);
		if (res.status === 200) return true;
		else return false;
	}

	onMount(() => {
		emailError = '';
		passwordError = '';
		emailPasswordLoading = false;
		googleLoading = false;
	});
</script>

<div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
	<div class="card-body">
		<form on:submit={loginWithEmailAndPassword}>
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
					class:input-error={emailError}
				/>
				<label for="email" class="label">
					{#if emailError}
						<span class="label-text-alt text-error">{emailError}</span>
					{/if}
				</label>
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
				<label for="password" class="label">
					{#if passwordError}
						<span class="label-text-alt text-error">{passwordError}</span>
					{/if}
				</label>
			</div>
			<div class="form-control mt-6">
				<input
					type="submit"
					class="btn btn-primary"
					value="Login"
					class:loading={emailPasswordLoading}
				/>
				<label class="label" for="submit">
					<a href="#" class="label-text-alt link link-hover">Forgot password?</a>
				</label>
			</div>
		</form>
		<div class="divider">OR</div>
		<div class="form-control">
			<button
				class="btn btn-secondary gap-2"
				on:click={registerWithGoogle}
				class:loading={googleLoading}
				disabled={emailPasswordLoading}
			>
				Sign in with Google
			</button>
		</div>
		<a href="/auth/register" class="label-text-alt link link-hover"> Don't have an account yet? </a>
	</div>
</div>
