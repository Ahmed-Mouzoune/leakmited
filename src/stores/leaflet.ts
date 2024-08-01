// stores/store.ts
import type {
	IHighway,
	LeafletGeoJson,
	TMaxSpeedLimit,
	TMaxSpeedOption
} from '$lib/domain/entities/Leaflet';
import { writable } from 'svelte/store';

// Store pour les données des routes
export const routesStore = writable<IHighway[]>([]);

// Store pour le filtre de vitesse
export const maxSpeedLimitStore = writable<TMaxSpeedLimit>(undefined);
export const MaxSpeedFilters: TMaxSpeedOption[] = [
	{
		value: undefined,
		label: 'Toutes les routes',
		color: ''
	},
	{
		value: 30,
		label: '30',
		color: 'green'
	},
	{
		value: 50,
		label: '50',
		color: 'blue'
	},
	{
		value: 70,
		label: '70',
		color: 'red'
	},
	{
		value: 90,
		label: '90',
		color: 'purple'
	}
];

export const geoJsonDataStore = writable<LeafletGeoJson>();
