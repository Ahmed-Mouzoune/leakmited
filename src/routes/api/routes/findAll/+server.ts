import { json } from '@sveltejs/kit';
import { fetchAllRoutes } from '$lib/database';

let cachedData = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1440 * 1000;

export async function GET() {
	try {
		const currentTime = Date.now();
		const isCacheValid = cachedData && currentTime - lastFetchTime < CACHE_TTL;

		if (isCacheValid) {
			return json({ geoJsonData: cachedData }, { status: 200 });
		}
		const geoJsonData = await fetchAllRoutes();
		cachedData = geoJsonData;
		lastFetchTime = currentTime;

		return json({ geoJsonData }, { status: 200 });
	} catch (error) {
		return json(
			{
				geoJsonData: null,
				error: 'Impossible de récupérer les données des routes'
			},
			{ status: 500 }
		);
	}
}
