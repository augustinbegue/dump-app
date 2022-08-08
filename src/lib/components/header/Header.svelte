<script lang="ts">
	import { goto } from '$app/navigation';

	import { auth, currentUser } from '$lib/modules/firebase/client';
</script>

<header class="navbar bg-base-300 shrink-0">
	<div class="navbar-start">
		<a class="btn btn-ghost uppercase font-bold" href="/">dump</a>
	</div>
	<div class="navbar-center">
		<div class="form-control">
			<div class="input-group input-group-sm mx-8">
				<input type="text" placeholder="search…" class="input input-sm" />
				<button class="btn btn-sm btn-square">
					<i class="fa-solid fa-magnifying-glass" />
				</button>
			</div>
		</div>
	</div>
	<div class="navbar-end">
		{#if $currentUser != null}
			<a href="/{$currentUser?.username}/new" class="btn btn-ghost text-base">publish</a>
			<div class="dropdown dropdown-end">
				<label tabindex="0" class="btn btn-ghost px-2 lowercase font-bold text-base" for="dropdown">
					<div class="avatar">
						<div class="w-10 rounded-full">
							<img src={$currentUser?.photoUrl} alt={$currentUser?.username} />
						</div>
					</div>
				</label>
				<ul
					tabindex="0"
					class="menu bg-base-200 dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4"
				>
					<li class="menu-title">
						<span class="text-base">@{$currentUser.username}</span>
					</li>
					<li><a href="/{$currentUser.username}">Profile</a></li>
					<div class="divider my-0 py-0" />
					<li>
						<btn
							on:click={async () => {
								await auth.signOut();
								window.location.reload();
							}}
						>
							Logout
						</btn>
					</li>
				</ul>
			</div>
			<div class="dropdown dropdown-end">
				<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
					<li>@{$currentUser.username}</li>
					<li><a>Item 2</a></li>
				</ul>
			</div>
		{:else}
			<a class="btn btn-ghost lowercase text-base font-bold" href="/auth/login">login</a>
		{/if}
	</div>
</header>
