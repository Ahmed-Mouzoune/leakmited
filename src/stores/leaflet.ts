// stores/store.ts
import type { LeafletGeoJson, TMaxSpeedLimit, TMaxSpeedOption } from '$lib/domain/entities/Leaflet';
import { writable } from 'svelte/store';

export const MaxSpeedFilters: TMaxSpeedOption[] = [
	{
		value: 30,
		label: '30',
		color: '#22c55e'
	},
	{
		value: 50,
		label: '50',
		color: '#0ea5e9'
	},
	{
		value: 70,
		label: '70',
		color: '#ef4444'
	},
	{
		value: 90,
		label: '90',
		color: '#a855f7'
	}
];
// Store pour le filtre de vitesse
export const maxSpeedLimitStore = writable<TMaxSpeedLimit[]>([MaxSpeedFilters[0].value]);

export const geoJsonDataStore = writable<LeafletGeoJson>();
