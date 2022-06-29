<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
</script>

<svelte:head>
	<title>Dump</title>
	<meta name="description" content="Content sharing app" />
</svelte:head>

<div class="hero p-64 bg-base-300">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">DUMP</h1>
			<p class="py-6">Share your content with the world.</p>
			<div class="flex flex-col items-center">
				<a class="btn btn-primary w-fit" href="/user/register">Get Started</a>
				<a class="link-primary text-sm mt-1" href="/user/login">Already dumping?</a>
			</div>
		</div>
	</div>
</div>
