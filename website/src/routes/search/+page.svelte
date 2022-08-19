<script lang="ts">
	import { goto } from '$app/navigation';

	import UserSearchBar from '$lib/components/inputs/UserSearchBar.svelte';
</script>

<div class="w-full p-2 bg-base-300">
	<UserSearchBar
		wfull={true}
		onclick={(user) => {
			goto(`/${user.username}`);
		}}
	/>
</div>
