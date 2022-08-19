<script lang="ts">
	import { auth, firebaseUser } from '$lib/modules/firebase/client';
</script>

<svelte:head>
	<title>Dump</title>
	<meta name="description" content="Content sharing app" />
</svelte:head>

{#if $firebaseUser}
	<div class="hero bg-base-100 min-h-full">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<p>your feed is coming soon</p>
			</div>
		</div>
	</div>
{:else}
	<div class="hero bg-base-100 min-h-full">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="text-5xl font-bold">DUMP</h1>
				<p class="py-6">Share your content with the world.</p>
				<div class="flex flex-col items-center">
					<a class="btn btn-primary w-fit" href="/auth/register">Get Started</a>
					<a class="link-primary text-sm mt-1" href="/auth/login">Already dumping?</a>
				</div>
			</div>
		</div>
	</div>
{/if}
