<script lang="ts">
	import FilterRoadSpeed from '$lib/components/dashboard/FilterRoadSpeed.svelte';
	import Map from '$lib/components/dashboard/Map.svelte';
	import RoadDocumentation from '$lib/components/dashboard/RoadDocumentation.svelte';
	import { onMount } from 'svelte';

	export let data;
	const { geoJsonData: initialGeoData } = data;
	let geoJsonDataUpdate: object | null = null;

	onMount(async () => {
		try {
			const response = await fetch('/api/routes/findAll');
			if (response.ok) {
				const res = await response.json();
				geoJsonDataUpdate = res.geoJsonData;
			}
			if (!response.ok) console.error('Erreur lors du fetch des routes');
		} catch (error) {
			console.error('Erreur lors du fetch:', error);
		}
	});
</script>

<main class="container">
	<h1 class="my-4 text-center text-3xl">Carte de l'Île-de-France</h1>
	<div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
		<div class="flex flex-col gap-4 sm:col-span-1">
			<FilterRoadSpeed />
			<RoadDocumentation geoJsonData={geoJsonDataUpdate ? geoJsonDataUpdate : initialGeoData} />
		</div>
		<div class="sm:col-span-2">
			<Map geoJsonData={geoJsonDataUpdate ? geoJsonDataUpdate : initialGeoData} />
		</div>
	</div>
</main>
