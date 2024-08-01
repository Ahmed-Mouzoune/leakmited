import type { LayerGroup } from 'leaflet';

interface ILeafletRepository {
	createMap({ mapContainer, lat, lng, alt, zoom }: IMapOption): void | L.Map;
	createLayerGroup({
		geoJsonData,
		map,
		layerGroup,
		maxSpeedLimit
	}: ICreateLayerGroup): LeafletLayerGroup;
	removeLayerGroup(layerGroup: LayerGroup): void;
	fetchHighwayMaxSpeed({ around, lat, lng }: IFetchHighwayMaxSpeed): LeafletGeoJson;
}
interface ICreateLayerGroup {
	geoJsonData: LeafletGeoJson;
	map: L.Map;
	maxSpeedLimit: TMaxSpeedLimit;
}
interface IFetchHighwayMaxSpeed {
	around: number;
	lat: number;
	lng: number;
}
