<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { browser } from '$app/environment';
	import { maxSpeedLimitStore, geoJsonDataStore } from '../../../stores/leaflet';
	import { Button } from '$lib/components/ui/button/index.js';
	import osmtogeojson from 'osmtogeojson';
	import { LeafletRepository } from '$lib/infrastructure/repositories/LeafletRepository';

	let mapContainer: HTMLDivElement;
	let map: L.Map | undefined;
	let layerGroup: LeafletLayerGroup;
	let geoJsonData: LeafletGeoJson;
	const LeafletRepo = new LeafletRepository();

	onMount(async () => {
		if (browser) {
			// Coordonnées île de france
			const latIDF: number = 48.8566;
			const lngIDF: number = 2.3522;
			const around = '5000';
			// const around = '2000';
			map = LeafletRepo.createMap({
				mapContainer,
				lat: latIDF,
				lng: lngIDF
			});
			// geoJsonData = await LeafletRepo.fetchHighwayMaxSpeedOverpassApi({
			// 	around,
			// 	lat: latIDF,
			// 	lng: lngIDF
			// });
			geoJsonData = await LeafletRepo.fetchHighwayMaxSpeedLocal();
			geoJsonDataStore.set(geoJsonData);
		}
	});

	$: {
		if (map) {
			LeafletRepo.removeLayerGroup(layerGroup);
			layerGroup = LeafletRepo.createLayerGroup({
				geoJsonData: $geoJsonDataStore,
				layerGroup: layerGroup,
				map,
				maxSpeedLimit: $maxSpeedLimitStore
			})?.addTo(map);
		}
	}

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div bind:this={mapContainer}></div>

<style>
	div {
		min-height: 500px;
		height: 100%;
	}
</style>
