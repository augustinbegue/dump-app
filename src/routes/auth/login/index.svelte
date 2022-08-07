<script lang="ts">
	import { goto } from '$app/navigation';

	import LoginForm from '$lib/components/ui/inputs/LoginForm.svelte';
	import { auth } from '$lib/modules/firebase/client';
	import { onMount } from 'svelte';

	function onLogin(result: string) {
		switch (result) {
			case 'success':
				goto('/');
				break;
			case 'failure':
				break;
			case 'next':
				goto('/register/next');
				break;
			default:
				break;
		}
	}

	onMount(async () => {
		if (auth.currentUser != null) {
			try {
				let res = await fetch(`/api/user/${auth.currentUser.uid}`);
				let data = await res.json();

				if (res.status === 200) {
					goto(`/${data.user.username}`);
				} else {
					goto('/auth/register/next');
				}
			} catch (error) {
				console.error(error);
			}
		}
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
