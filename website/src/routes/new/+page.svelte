<script>
	import { page } from '$app/stores';
</script>

<div class="container mx-auto flex flex-col md:flex-row w-full h-full py-4 md:py-16">
	<a
		class="btn grid flex-grow card bg-base-300 rounded-box place-items-center md:h-full text-2xl"
		href="/new/post"
	>
		post
	</a>
	<div class="divider md:divider-horizontal">or</div>
	<a
		class="btn grid flex-grow card bg-base-300 rounded-box place-items-center md:h-full text-2xl"
		href="/new/collection"
	>
		collection
	</a>
</div>
