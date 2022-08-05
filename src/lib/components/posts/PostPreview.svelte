<script lang="ts">
	let urls = [
		'https://placeimg.com/1000/400/arch',
		'https://placeimg.com/512/512/arch',
		'https://placeimg.com/400/500/arch',
		'https://placeimg.com/500/400/arch'
	];
	let url = urls[Math.floor(Math.random() * urls.length)];
</script>

<div class="card bg-base-100 shadow-xl image-full h-fit max-w-1/4">
	<figure>
		<img src={url} alt="Post Title" style="height: auto !important;" class="w-full object-center" />
	</figure>
	<div class="card-body">
		<h2 class="card-title">Post Title</h2>
		<p>{url}</p>
	</div>
</div>
