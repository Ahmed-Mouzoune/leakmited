import L, { LayerGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { browser } from '$app/environment';
import { MaxSpeedFilters } from '../../../stores/leaflet';
import osmtogeojson from 'osmtogeojson';
import type {
	ICreateLayerGroup,
	IFetchHighwayMaxSpeed,
	ILeafletRepository
} from '$lib/domain/repositories/LeafletRepository';
import type { IMapOption, LeafletLayerGroup } from '$lib/domain/entities/Leaflet';

// Assurez-vous que votre fichier GeoJSON est accessible via `/data/speed_limits.geojson`
const localGeoJsonUrl = '/data/48-8566_2-3522_5000.geojson';

export class LeafletRepository implements ILeafletRepository {
	async fetchHighwayMaxSpeedLocal() {
		const response = await fetch(localGeoJsonUrl);
		const geoJsonData = await response.json();
		return geoJsonData;
	}
	async fetchHighwayMaxSpeedOverpassApi({ around, lat, lng }: IFetchHighwayMaxSpeed) {
		const overpassUrl = 'https://overpass-api.de/api/interpreter';
		const query = `
				[out:json];
				(
				  way
				    [highway]
				    [maxspeed]
				    (around:${around.toString()},${lat.toString()},${lng.toString()});
				);
				out body;
				>;
				out skel qt;
			`;

		const response = await fetch(overpassUrl, {
			method: 'POST',
			cache: 'reload',
			body: query,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
		const data = await response.json();
		return osmtogeojson(data);
	}
	createMap({ mapContainer, lat, lng, alt, zoom = 13 }: IMapOption): void | L.Map {
		let map: L.Map;
		if (browser) {
			map = L.map(mapContainer).setView([lat, lng], zoom);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);
			return map;
		}
	}
	createLayerGroup({ geoJsonData, map, maxSpeedLimit }: ICreateLayerGroup): LeafletLayerGroup {
		if (geoJsonData && map) {
			return L.geoJSON(geoJsonData, {
				style: (feature) => {
					const maxspeed = Number(feature?.properties?.maxspeed);
					let color: string | undefined = MaxSpeedFilters.filter(
						(option) => option.value == maxspeed
					)?.[0]?.color;
					return { color, className: 'stroke-2' };
				},
				onEachFeature: (feature, layer) => {
					const maxspeed = Number(feature?.properties?.maxspeed);
					if (layer && maxSpeedLimit.includes(maxspeed))
						layer.bindPopup(`Limitation de vitesse: ${feature.properties.maxspeed} km/h`);
				},
				filter: (geoJsonFeature) => {
					const maxspeed = Number(geoJsonFeature?.properties?.maxspeed);
					if (!maxspeed) return false;
					if (!maxSpeedLimit.includes(maxspeed)) return false;
					return true;
				}
			});
		}
		return undefined;
	}
	removeLayerGroup(layerGroup: LayerGroup): void {
		if (layerGroup) layerGroup.clearLayers();
	}
}
