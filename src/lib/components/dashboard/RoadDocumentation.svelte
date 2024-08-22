<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { PieChart, type ChartTabularData, type PieChartOptions } from '@carbon/charts-svelte';
	import '@carbon/charts-svelte/styles.css';
	import {
		converMaxSpeedFilterToPieChartColors,
		convertGeoJsonToCarbonChartData
	} from '$lib/domain/usecases/Leaflet';
	export let geoJsonData: LeafletGeoJson | null;
	$: data = convertGeoJsonToCarbonChartData(geoJsonData);

	const chartColors = converMaxSpeedFilterToPieChartColors();
	let options: PieChartOptions = {
		title: 'Pourcentage de route en km/h',
		resizable: true,
		height: '300px',

		color: {
			scale: chartColors
		}
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Description>Données fourni par OpenStreetMap</Card.Description>
		{#if data}
			<PieChart {data} {options} />
		{/if}
	</Card.Header>
</Card.Root>
