<script lang="ts">
	import type { LayoutData } from "./$types";

	export let data : LayoutData;
	$: ({ url } = data);
</script>

<div class="container mx-auto flex flex-row h-full">
	<ul class="menu bg-base-100 w-56 p-2 rounded-box font-medium">
		<li class:bordered={url.endsWith('profile')}>
			<a href="/settings/profile"> public profile </a>
		</li>
		<li class:bordered={url.endsWith('details')}>
			<a href="/settings/details"> account details </a>
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
