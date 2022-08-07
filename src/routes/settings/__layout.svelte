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

<div class="container mx-auto flex flex-row">
	<ul class="menu bg-base-100 w-56 p-2 rounded-box">
		<li class:bordered={url.endsWith('profile')}>
			<span>
				<i class="fa-solid fa-user" />
				public profile
			</span>
		</li>
	</ul>
	<div class="card bg-base-300 my-2 w-full">
		<div class="card-body">
			<slot />
		</div>
	</div>
</div>
