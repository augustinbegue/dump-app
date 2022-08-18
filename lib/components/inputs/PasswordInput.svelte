<script lang="ts">
	export let password: string;
	export let passwordError: string;
	export let passwordLabel = 'Password';
	$: {
		if (password && password.length > 0) {
			if (password.match(/(?=.*[0-9a-zA-Z]).{8,}/gim)) {
				passwordError = undefined;
			} else {
				passwordError = 'Password is too weak.';
			}
		}
	}
</script>

<div class="form-control">
	<label class="label" for="password">
		<span class="label-text">{passwordLabel}</span>
	</label>
	<input
		bind:value={password}
		id="password"
		type="password"
		placeholder={passwordLabel.toLowerCase()}
		class="input input-bordered"
		class:input-error={passwordError}
	/>
	{#if passwordError}
		<label class="label" for="password">
			<span class="label-text-alt text-error">{passwordError}</span>
		</label>
	{/if}
</div>
