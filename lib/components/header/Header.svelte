<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, currentUser } from '$lib/modules/firebase/client';
	import UserSearchBar from '../inputs/UserSearchBar.svelte';
</script>

<header class="navbar bg-base-300 shrink-0">
	<div class="navbar-start">
		<a class="btn btn-ghost uppercase font-bold" href="/">dump</a>
	</div>
	<div class="hidden md:flex navbar-center">
		<UserSearchBar
			onclick={(user) => {
				goto(`/${user.username}`);
			}}
		/>
	</div>
	<div class="navbar-end">
		{#if $currentUser != null}
			<a href="/new" class="hidden md:flex btn btn-ghost text-base">publish</a>
			<div class="dropdown dropdown-end">
				<label tabindex="0" class="btn btn-ghost px-2 lowercase font-bold text-base" for="dropdown">
					<div class="avatar">
						<div class="w-10 rounded-full">
							<img src={$currentUser?.photoUrl} alt={$currentUser?.username} />
						</div>
					</div>
				</label>
				<ul tabindex="0" class="menu bg-base-200 dropdown-content p-2 shadow rounded-box w-52 mt-4">
					<li class="menu-title">
						<span class="text-base">@{$currentUser.username}</span>
					</li>
					<li><a href="/{$currentUser.username}">profile</a></li>
					<li><a href="/settings">settings</a></li>
					<div class="divider my-0 py-0" />
					<li>
						<btn
							on:click={async () => {
								await auth.signOut();
								window.location.reload();
							}}
						>
							logout
						</btn>
					</li>
				</ul>
			</div>
		{:else}
			<a class="btn btn-ghost lowercase text-base font-bold" href="/auth/login">login</a>
		{/if}
	</div>
</header>
