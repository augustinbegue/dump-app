<script lang="ts">
	import { page } from '$app/stores';
	import { firebaseUser } from '$lib/modules/firebase/client';
	import type { User } from '@prisma/client';

	let username = $page.params.username;
	export let user: User;
</script>

{user.username}
{user.uid == $firebaseUser?.uid ? 'You are logged in' : 'You are not logged in'}
