<script lang="ts">
	import { goto } from '$app/navigation';

	import type { User } from '@prisma/client';

	export let user: User;
</script>

<div class="flex flex-row gap-2 justify-center items-center ">
	<div class="avatar flex items-center justify-center">
		<div class="w-10 rounded-full">
			<img src={user.photoUrl} alt="{user.username}'s profile picture" />
		</div>
	</div>
	<p class="text-base">@{user.username}</p>
</div>
