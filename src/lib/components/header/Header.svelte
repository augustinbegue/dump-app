<script lang="ts">
	import { auth, userStore } from '$lib/modules/firebase/client';
</script>

<header class="navbar bg-base-300">
	<div class="navbar-start">
		<a class="btn btn-ghost uppercase font-bold" href="/">dump</a>
	</div>
	<div class="navbar-end">
		{#if !!$userStore}
			<a class="btn btn-ghost uppercase font-bold" href="/user">{$userStore.displayName}</a>
			<button
				class="btn btn-ghost uppercase"
				on:click={() => {
					auth.signOut();
				}}
			>
				Logout
			</button>
		{:else}
			<a class="btn btn-ghost uppercase font-bold" href="/user/login">login</a>
		{/if}
	</div>
</header>

<style>
</style>
