/** @type {import('./$types').PageServerLoad} */

import { fetchRoutes } from '$lib/database';

let cachedData = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1440 * 1000; // Durée de vie du cache : 24 heures

export const load = async () => {
	try {
		console.log('load server');

		const currentTime = Date.now();
		const isCacheValid = cachedData && currentTime - lastFetchTime < CACHE_TTL;

		// Si le cache est valide, retourner les données en cache
		if (isCacheValid) {
			console.log('Serving from cache');
			return {
				geoJsonData: cachedData
			};
		}

		// Si le cache n'est pas valide, on récupère les données depuis la base de données
		console.log('Fetching from database');
		const geoJsonData = await fetchRoutes();
		// const geoJsonData = await LeafletRepository.fetchHighwayMaxSpeedOverpassApi();

		// Mettre à jour le cache
		cachedData = geoJsonData;
		lastFetchTime = currentTime;

		return {
			geoJsonData
		};
	} catch (error) {
		console.error('Erreur lors du chargement des routes:', error);
		return {
			geoJsonData: null,
			error: 'Impossible de récupérer les données des routes'
		};
	}
};
