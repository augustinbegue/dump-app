<script lang="ts">
	import type { User } from '@prisma/client';

	import { firebaseUser } from '$lib/modules/firebase/client';
	import type { FollowingOutput } from '$lib/types/api';

	export let user: User;
	$: isLoggedInUser = user.uid === $firebaseUser?.uid;
	let followedByLoggedInUser = false;
	$: $firebaseUser, checkIfLoggedInUserFollows();

	async function checkIfLoggedInUserFollows() {
		if (isLoggedInUser) return;

		if (!$firebaseUser) {
			followedByLoggedInUser = false;
		} else {
			let res = await fetch(`/api/users/${$firebaseUser?.uid}/following/${user.uid}`);
			let data = (await res.json()) as FollowingOutput;
			followedByLoggedInUser = data.following.length > 0;
		}
	}

	async function onFollowClick() {
		if (isLoggedInUser) return;

		let res = await fetch(`/api/users/${user.uid}/followers`, {
			method: 'POST',
			body: JSON.stringify({
				uid: $firebaseUser?.uid
			})
		});

		if (followedByLoggedInUser) {
			if (res.status === 200) {
				user.followersCount--;
				followedByLoggedInUser = false;
			}
		} else {
			if (res.status === 200) {
				user.followersCount++;
				followedByLoggedInUser = true;
			}
		}
	}
</script>

<button class="btn btn-sm" on:click={onFollowClick}>
	{followedByLoggedInUser ? 'following' : 'follow'}
</button>
