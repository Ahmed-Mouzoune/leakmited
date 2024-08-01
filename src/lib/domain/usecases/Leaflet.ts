import type { ChartTabularData } from '@carbon/charts-svelte';
import type { LeafletGeoJson } from '../entities/Leaflet';
import { MaxSpeedFilters } from '../../../stores/leaflet';

export const convertGeoJsonToCarbonChartData = (geoJsonData: LeafletGeoJson) => {
	let data: ChartTabularData = [];
	if (geoJsonData?.type === 'FeatureCollection') {
		data = MaxSpeedFilters.slice(1).map((MaxSpeedFilter) => ({
			group: MaxSpeedFilter.label,
			maxspeed: MaxSpeedFilter.value,
			value: geoJsonData?.features?.filter(
				(feature: any) => feature?.properties?.maxspeed === MaxSpeedFilter.value?.toString()
			)?.length
		}));
	}
	return data;
};

export const converMaxSpeedFilterToPieChartColors = () => {
	return MaxSpeedFilters.reduce(
		(acc, filter) => {
			if (filter.value !== undefined) {
				acc[filter.value] = filter.color;
			}
			return acc;
		},
		{} as Record<number, string>
	);
};
