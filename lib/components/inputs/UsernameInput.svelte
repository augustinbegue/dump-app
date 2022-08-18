<script lang="ts">
	export let username: string;
	export let usernameError: string;

	$: {
		if (username && username?.length != 0) {
			if (username.match(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim)) {
				usernameError = undefined;
			} else {
				usernameError = 'Username is invalid';
			}
		}
	}
</script>

<div class="form-control">
	<label for="username" class="label">
		<span class="label-text">Username</span>
	</label>
	<input
		bind:value={username}
		id="username"
		type="text"
		placeholder="username"
		class="input input-bordered"
		autocomplete="username"
		class:input-error={usernameError}
	/>
	{#if usernameError}
		<label class="label" for="username">
			<span class="label-text-alt text-error">{usernameError}</span>
		</label>
	{:else}
		<label class="label" for="username">
			<span class="label-text-alt opacity-50">
				This is what you'll use to share your profile.
			</span>
		</label>
	{/if}
</div>
