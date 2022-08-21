<script lang="ts">
	export let url: URL;

	$: {
		console.log(
			url?.toString().indexOf('/search') === -1 && url?.toString().indexOf('/new') === -1
		);
	}
</script>

<footer class="hidden md:flex footer h-16 p-2 bg-base-300 flex-row items-center shrink-0">
	<a class="footer-title link link-hover m-0" href="https://begue.cc">Augustin BÉGUÉ</a>
</footer>

<div class="p-6 md:hidden" />

<div class="z-50 btm-nav flex btm-nav-sm md:hidden">
	<a href="/new" class:active={url?.toString().indexOf('/new') != -1}>
		<span class="material-icons-outlined"> add </span>
	</a>
	<a
		href="/"
		class:active={url?.toString().indexOf('/search') === -1 &&
			url?.toString().indexOf('/new') === -1}
	>
		<span class="material-icons-outlined"> home </span>
	</a>
	<a href="/search" class:active={url?.toString().indexOf('/search') != -1}>
		<span class="material-icons-outlined"> search </span>
	</a>
</div>
