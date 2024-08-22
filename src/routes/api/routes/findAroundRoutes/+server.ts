import { json } from '@sveltejs/kit';
import { fetchRoutesAroundPoint } from '$lib/database';

export async function POST({ request }) {
	try {
		const { lat, lon, radius } = await request.json();

		const geoJsonData = await fetchRoutesAroundPoint({ lat, lon, radius });

		return json(geoJsonData);
	} catch (error) {
		console.error('Erreur lors du fetch des routes supplémentaires:', error);
		return json({ error: 'Erreur lors du fetch des routes' }, { status: 500 });
	}
}
