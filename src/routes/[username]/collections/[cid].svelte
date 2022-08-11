<script lang="ts">
	import type { Collection, User } from '@prisma/client';

	export let collection: Collection & {
		author: User;
		posts: {
			pid: string;
		}[];
		allowedUsers: {
			uid: string;
		}[];
	};
</script>
