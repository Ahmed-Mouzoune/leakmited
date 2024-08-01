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

export class LeafletRepository implements ILeafletRepository {
	async fetchHighwayMaxSpeed({ around, lat, lng }: IFetchHighwayMaxSpeed) {
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
					const color = MaxSpeedFilters.filter((option) => option.value == maxspeed)?.[0]?.color;
					// Si la vitesse de la route ne respecte pas le filtre on ne l'affiche pas
					if (maxSpeedLimit && maxSpeedLimit < maxspeed) return { color: undefined };
					return { color };
				},
				onEachFeature: (feature, layer) => {
					const maxspeed = Number(feature?.properties?.maxspeed);
					if (maxspeed) {
						if (maxSpeedLimit && maxspeed <= maxSpeedLimit) {
							layer.bindPopup(`Limitation de vitesse: ${feature.properties.maxspeed} km/h`);
						}
						if (!maxSpeedLimit) {
							layer.bindPopup(`Limitation de vitesse: ${feature.properties.maxspeed} km/h`);
						}
					}
				}
			});
		}
		return undefined;
	}
	removeLayerGroup(layerGroup: LayerGroup): void {
		if (layerGroup) layerGroup.clearLayers();
	}
}
