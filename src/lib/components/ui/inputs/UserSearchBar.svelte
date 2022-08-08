<script lang="ts">
	import type { User } from '@prisma/client';

	export let onclick: (selected: User) => void;
	let input: string;
	let users: User[] = [];

	async function oninput() {
		if (input.length < 3) {
			users = [];
			return;
		}

		users = (await (await fetch(`/api/user/search/${input}`)).json()).users;

		console.log(users);
	}
</script>

<div class="dropdown">
	<label for="search" tabindex="0">
		<form
			class="form-control"
			on:submit={(e) => {
				e.preventDefault();
				onclick(users[0]);
			}}
		>
			<input
				type="text"
				placeholder="search…"
				name="search"
				class="input input-bordered input-sm bg-base-300"
				autocomplete="off"
				bind:value={input}
				on:input={oninput}
			/>
		</form>
	</label>
	<ul tabindex="0" class="menu bg-base-200 dropdown-content p-2 shadow rounded-box w-52 mt-4">
		{#each users as user}
			<li>
				<span
					class="text-sm"
					on:click={() => {
						onclick(user);
					}}
				>
					<div class="avatar">
						<div class="w-10 rounded-full">
							<img src={user.photoUrl} alt={user.username} />
						</div>
					</div>
					<div class="inline-flex flex-col">
						<span class="font-medium">@{user.username}</span>
						<span>{user.name}</span>
					</div>
				</span>
			</li>
		{/each}
	</ul>
</div>
