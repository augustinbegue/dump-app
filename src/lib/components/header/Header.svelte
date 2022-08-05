<script lang="ts">
	import { auth } from '$lib/modules/firebase/client';
	import { currentUser } from '$lib/modules/auth';
</script>

<header class="navbar bg-base-300">
	<div class="navbar-start">
		<a class="btn btn-ghost uppercase font-bold" href="/">dump</a>
	</div>
	<div class="navbar-end">
		{#if $currentUser != null}
			<a class="btn btn-ghost uppercase font-bold" href="/{$currentUser?.username}">
				@{$currentUser?.username}
			</a>
			<button
				class="btn btn-ghost uppercase"
				on:click={() => {
					auth.signOut();
				}}
			>
				Logout
			</button>
		{:else}
			<a class="btn btn-ghost uppercase font-bold" href="/auth/login">login</a>
		{/if}
	</div>
</header>

<style>
</style>
