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

<div class="flex flex-row">
	<div>
		<ul class="menu bg-base-100 w-56 p-2 rounded-box">
			<li class:bordered={url.endsWith('profile')}>
				<span>
					<i class="fa-solid fa-user" />
					public profile
				</span>
			</li>
		</ul>
	</div>
	<div class="my-2">
		<slot />
	</div>
</div>
