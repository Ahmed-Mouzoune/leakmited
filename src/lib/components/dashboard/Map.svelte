<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { maxSpeedLimitStore } from '../../../stores/leaflet';
	import { Skeleton } from '$lib/components/ui/skeleton';

	export let geoJsonData: LeafletGeoJson | null;
	let LeafletRepo: null | ILeafletRepository = null;

	// Fonction pour charger le module côté client
	async function loadClientLib() {
		if (typeof window !== 'undefined') {
			const module = await import('$lib/infrastructure/repositories/LeafletRepository');
			LeafletRepo = new module.LeafletRepository();
		}
	}

	// let isLoading: boolean = false;
	let mapContainer: HTMLDivElement;
	let map: L.Map | undefined;
	let layerGroup: LeafletLayerGroup;

	onMount(async () => {
		await loadClientLib();
		if (browser) {
			// Coordonnées île de france
			const latIDF: number = 48.8566;
			const lngIDF: number = 2.3522;
			map = LeafletRepo.createMap({
				mapContainer,
				lat: latIDF,
				lng: lngIDF
			});
		}
	});

	$: {
		if (map) {
			// isLoading = true;
			LeafletRepo.removeLayerGroup(layerGroup);
			layerGroup = LeafletRepo.createLayerGroup({
				geoJsonData: geoJsonData,
				layerGroup: layerGroup,
				map,
				maxSpeedLimit: $maxSpeedLimitStore
			})?.addTo(map);
			// isLoading = false;
		}
	}

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div class="relative">
	<!-- {#if isLoading}
		<Skeleton class="absolute left-0 top-0 z-10 h-full w-full" />
	{/if}
	{#if !isLoading} -->
	<div class="map-leaflet" bind:this={mapContainer} />
	<!-- {/if} -->
</div>

<style>
	.map-leaflet {
		z-index: 0;
		min-height: 500px;
		height: 100%;
	}
</style>
