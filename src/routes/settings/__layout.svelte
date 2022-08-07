<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ url }) => {
		return {
			props: {
				url: url.toString()
			}
		};
	};
</script>

<script lang="ts">
	export let url: string;
</script>

<div class="container mx-auto flex flex-row h-full">
	<ul class="menu bg-base-100 w-56 p-2 rounded-box">
		<li class:bordered={url.endsWith('profile')}>
			<a href="/settings/profile">
				<i class="fa-solid fa-user" />
				public profile
			</a>
		</li>
		<li class:bordered={url.endsWith('details')}>
			<a href="/settings/details">
				<i class="fa-solid fa-circle-info" />
				account details
			</a>
		</li>
	</ul>
	<div class="h-full w-full py-2">
		<div class="card bg-base-200 w-full h-full">
			<div class="card-body">
				<slot />
			</div>
		</div>
	</div>
</div>
