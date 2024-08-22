<script>
	/** @type {import('./$types').PageData} */
	import RoadDocumentation from '$lib/components/dashboard/RoadDocumentation.svelte';
	import FilterRoadSpeed from '$lib/components/dashboard/FilterRoadSpeed.svelte';
	import Map from '$lib/components/dashboard/Map.svelte';

	export let data;
	const { geoJsonData } = data;
</script>

<main class="container">
	<h1 class="my-4 text-center text-3xl">Carte de l'Île-de-France</h1>
	<div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
		<div class="flex flex-col gap-4 sm:col-span-1">
			<FilterRoadSpeed />
			<RoadDocumentation {geoJsonData} />
		</div>
		<div class="sm:col-span-2">
			<Map {geoJsonData} />
		</div>
	</div>
</main>
