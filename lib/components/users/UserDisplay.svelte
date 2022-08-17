<script lang="ts">
	import { goto } from '$app/navigation';

	import type { User } from '@prisma/client';

	export let user: User;
	export let size = 'md';
</script>

<div on:click={() => goto(`/${user.username}`)} class="cursor-pointer">
	<div class="avatar w-full flex items-center justify-center">
		<div class="rounded-full" class:w-24={size === 'md'} class:w-16={size === 'sm'}>
			<img src={user.photoUrl} alt="{user.username}'s profile picture" />
		</div>
	</div>
	<div class="card-title flex-col items-center gap-0">
		<p class="text-base">@{user.username}</p>
	</div>
</div>
