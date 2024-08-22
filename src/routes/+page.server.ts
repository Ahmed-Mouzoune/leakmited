/** @type {import('./$types').PageServerLoad} */

import { fetchRoutesAroundPoint } from '$lib/database';

let cachedData = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1440 * 1000; // Durée de vie du cache : 24 heures

export const load = async () => {
	try {
		const currentTime = Date.now();
		const isCacheValid = cachedData && currentTime - lastFetchTime < CACHE_TTL;

		if (isCacheValid) {
			return {
				geoJsonData: cachedData
			};
		}

		const geoJsonData = await fetchRoutesAroundPoint({
			lat: 48.8566,
			lon: 2.3522,
			radius: 5000
		});

		cachedData = geoJsonData;
		lastFetchTime = currentTime;

		return {
			geoJsonData
		};
	} catch (error) {
		return {
			geoJsonData: null,
			error: 'Impossible de récupérer les données des routes'
		};
	}
};
