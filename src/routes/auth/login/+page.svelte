<script lang="ts">
	import { goto } from '$app/navigation';

	import LoginForm from '$lib/components/inputs/LoginForm.svelte';
	import { auth, firebaseUser } from '$lib/modules/firebase/client';
	import { onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';

	function onLogin(result: string) {
		console.log('LOGIN RESULT:', result);

		switch (result) {
			case 'success':
				goto('/');
				break;
			case 'failure':
				break;
			case 'next':
				goto('/auth/register/next');
				break;
			default:
				break;
		}
	}

	let us: Unsubscriber;
	onMount(async () => {
		us = firebaseUser.subscribe((user) => {
			if (user) {
				us();
				goto(`/auth/register/next`);
			}
		});
	});
</script>

<div class="hero min-h-full bg-base-200">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Login now!</h1>
			<p class="py-6">
				Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
				quasi. In deleniti eaque aut repudiandae et a id nisi.
			</p>
		</div>
		<LoginForm {onLogin} />
	</div>
</div>
