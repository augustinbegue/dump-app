<script>
	import { page } from '$app/stores';
</script>

<div class="container mx-auto flex w-full h-full py-16">
	<a
		class="btn grid flex-grow card bg-base-300 rounded-box place-items-center h-full text-2xl"
		href="/{$page.params.username}/new/post"
	>
		post
	</a>
	<div class="divider divider-horizontal">or</div>
	<a
		class="btn grid flex-grow card bg-base-300 rounded-box place-items-center h-full text-2xl"
		href="/{$page.params.username}/new/collection"
	>
		collection
	</a>
</div>
