import { LayerGroup } from 'leaflet';
import { FeatureCollection } from 'osmtogeojson';

interface IMapOption {
	mapContainer: HTMLDivElement;
	// latitude
	lat: number;
	// longitude
	lng: number;
	alt?: number;
	zoom: number;
}
interface IHighway {
	id: string;
	maxspeed: number;
	geometry: { lat: number; lon: number }[];
}

type LeafletGeoJson = FeatureCollection;

type LeafletLayerGroup = LayerGroup | null | undefined;

type TMaxSpeedLimit = number;
type TMaxSpeedOption = {
	value: TMaxSpeedLimit;
	label: string;
	disabled?: boolean;
	color: string;
	checked?: boolean;
};
