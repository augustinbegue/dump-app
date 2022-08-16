<script context="module" lang="ts">
import type { RequestEvent } from "@sveltejs/kit";

	export function load({error, status}: RequestEvent) {
		return {
			props: {
				error,
				status
			}
		}
	}
</script>

<script lang="ts">
	export let error: Error;
	export let status: number;
</script>

<div class="hero bg-base-100 min-h-full">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">{status}</h1>
			<p class="py-6">Oy are you lost mate?</p>
			<div class="flex flex-col items-center">
				<a class="btn btn-primary w-fit" href="/">Go back home</a>
			</div>
		</div>
	</div>
</div>
