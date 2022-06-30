<script lang="ts">
	import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { auth, googleProvider } from '$lib/modules/firebase/client';
	import { goto } from '$app/navigation';
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
			let credentials = await signInWithEmailAndPassword(auth, email, password);
			return goto('/');
		} catch (error) {
			emailPasswordLoading = false;
			if (error instanceof FirebaseError) {
				if (error.code === 'auth/user-not-found') {
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
		}
	}

	let googleLoading: boolean = false;
	async function registerWithGoogle() {
		try {
			googleLoading = true;
			let credentials = await signInWithPopup(auth, googleProvider);
			return goto('/');
		} catch (error) {
			googleLoading = false;
			console.error(error);
		}
	}

	onMount(async () => {
		emailError = '';
		passwordError = '';
		emailPasswordLoading = false;
		googleLoading = false;

		if (auth.currentUser != null) {
			try {
				let res = await fetch(`/api/user/${auth.currentUser.uid}`);
				let user = await res.json();
				if (res.status === 200) {
					goto(`/${user.username}`);
				} else {
					goto('/auth/register/next');
				}
			} catch (error) {
				console.error(error);
			}
		}
	});
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Login now!</h1>
			<p class="py-6">
				Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
				quasi. In deleniti eaque aut repudiandae et a id nisi.
			</p>
		</div>
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
						class="btn btn-secondary"
						on:click={registerWithGoogle}
						class:loading={googleLoading}
						disabled={emailPasswordLoading}
					>
						Sign in with Google
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
