import dotenv from 'dotenv';
import pg from 'pg';
const { Pool } = pg;

dotenv.config();

const pool = new Pool({
	user: process.env.POSTGRES_USER || 'postgres',
	host: process.env.POSTGRES_HOST || 'localhost',
	database: process.env.POSTGRES_DB || 'osm_database',
	password: process.env.POSTGRES_PASSWORD || 'password',
	port: parseInt(process.env.POSTGRES_PORT || '54325', 10),
	idleTimeoutMillis: 30000
});

export async function fetchRoutesAroundPoint({
	lat,
	lon,
	radius
}: {
	lat: number;
	lon: number;
	radius: number;
}) {
	try {
		const query = `SELECT maxspeed, ST_AsGeoJSON(ST_Transform(way, 4326)) as geojson
		   FROM planet_osm_roads
		   WHERE highway IS NOT NULL
		   AND maxspeed IS NOT NULL
			AND ST_DWithin(way, ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 3857), $3)
		`;
		const result = await pool.query(query, [lon, lat, radius]);

		const features = result.rows.map((row) => ({
			type: 'Feature',
			geometry: JSON.parse(row.geojson),
			properties: {
				maxspeed: row.maxspeed
			}
		}));

		const geojson = {
			type: 'FeatureCollection',
			features: features
		};

		return geojson;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(`Erreur lors de la récupération des routes: ${error.message}`);
		}

		throw new Error('Erreur inconnue lors de la récupération des routes');
	}
}

export async function fetchAllRoutes() {
	try {
		const result = await pool.query(
			`SELECT maxspeed, ST_AsGeoJSON(ST_Transform(way, 4326)) as geojson
			FROM (
				SELECT maxspeed, way
				FROM planet_osm_line
				WHERE highway IS NOT NULL
				AND maxspeed IS NOT NULL
				UNION
				SELECT maxspeed, way
				FROM planet_osm_roads
				WHERE highway IS NOT NULL
				AND maxspeed IS NOT NULL
			) AS combined;
			`
		);

		const features = result.rows.map((row) => ({
			type: 'Feature',
			geometry: JSON.parse(row.geojson),
			properties: {
				maxspeed: row.maxspeed
			}
		}));

		const geojson = {
			type: 'FeatureCollection',
			features: features
		};

		return geojson;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(`Erreur lors de la récupération des routes: ${error.message}`);
		}

		throw new Error('Erreur inconnue lors de la récupération des routes');
	}
}
