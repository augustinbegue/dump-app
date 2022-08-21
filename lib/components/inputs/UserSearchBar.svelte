<script lang="ts">
	import type { User } from '@prisma/client';

	export let onclick: (selected: User) => void;
	export let closeOnSelect = false;
	export let wfull = false;

	let input: string;
	let users: User[] = [];
	let container: HTMLElement;

	async function oninput() {
		if (input.length < 3) {
			users = [];
			return;
		}

		users = (await (await fetch(`/api/users/search/${input}`)).json()).users;
	}
</script>

<div class="dropdown" class:w-full={wfull}>
	<label for="search" tabindex="0">
		<form
			class="form-control"
			on:submit={(e) => {
				e.preventDefault();

				if (users.length === 0) return;

				onclick(users[0]);
				if (closeOnSelect) {
					users = [];
					input = '';
					e.currentTarget.blur();
				}
			}}
		>
			<input
				bind:this={container}
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
	<ul
		tabindex="0"
		class="menu bg-base-200 dropdown-content p-2 shadow rounded-box mt-4"
		class:w-full={wfull}
		class:w-52={!wfull}
		class:hidden={users.length <= 0}
	>
		{#each users as user}
			<li>
				<span
					class="text-sm"
					on:click={(e) => {
						onclick(user);
						if (closeOnSelect) {
							users = [];
							input = '';
							e.currentTarget.parentElement?.parentElement?.blur();
						}
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
