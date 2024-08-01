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
			geoJsonData = await LeafletRepo.fetchHighwayMaxSpeed({
				around,
				lat: latIDF,
				lng: lngIDF
			});
			geoJsonDataStore.set(geoJsonData);
		}
		maxSpeedLimitStore.subscribe(async (value) => {
			if (layerGroup) await LeafletRepo.removeLayerGroup(layerGroup);
			layerGroup = await LeafletRepo.createLayerGroup({
				geoJsonData: $geoJsonDataStore,
				map,
				maxSpeedLimit: $maxSpeedLimitStore
			})?.addTo(map);
		});
	});

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
