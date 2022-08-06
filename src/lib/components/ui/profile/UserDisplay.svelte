<script lang="ts">
	import { goto } from '$app/navigation';

	import type { User } from '@prisma/client';

	export let user: User;
</script>

<div on:click={() => goto(`/${user.username}`)} class="cursor-pointer">
	<div class="avatar w-full flex items-center justify-center">
		<div class="w-24 rounded-full">
			<img src={user.photoUrl} alt="{user.username}'s profile picture" />
		</div>
	</div>
	<div class="card-title flex-col items-center gap-0">
		<p class="text-base">@{user.username}</p>
	</div>
</div>
