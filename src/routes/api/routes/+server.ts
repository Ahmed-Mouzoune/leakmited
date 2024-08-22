import { json } from '@sveltejs/kit';
import { fetchRoutes } from '$lib/database';

let cachedData = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1440 * 1000;

export async function GET() {
	try {
		console.log('load server');

		const currentTime = Date.now();
		const isCacheValid = cachedData && currentTime - lastFetchTime < CACHE_TTL;

		console.log('isCacheValid', isCacheValid);

		if (isCacheValid) {
			console.log('Serving from cache');
			return json({ geoJsonData: cachedData }, { status: 200 });
		}
		console.log('Fetching from database');
		const geoJsonData = await fetchRoutes();
		cachedData = geoJsonData;
		lastFetchTime = currentTime;

		return json({ geoJsonData }, { status: 200 });
	} catch (error) {
		console.error('Erreur lors de la récupération des routes:', error);
		return json(
			{
				geoJsonData: null,
				error: 'Impossible de récupérer les données des routes'
			},
			{ status: 500 }
		);
	}
}
