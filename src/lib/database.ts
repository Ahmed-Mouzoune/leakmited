// src/lib/database.ts

import pg from 'pg';
import dotenv from 'dotenv';
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

export async function fetchRoutes() {
	try {
		const result = await pool.query(
			`SELECT osm_id, highway, name, maxspeed, ST_AsGeoJSON(ST_Transform(way, 4326)) as geojson
       FROM planet_osm_roads
       WHERE highway IS NOT NULL
       AND maxspeed IS NOT NULL`
		);

		const features = result.rows.map((row) => ({
			type: 'Feature',
			geometry: JSON.parse(row.geojson),
			properties: {
				osm_id: row.osm_id,
				highway: row.highway,
				name: row.name,
				maxspeed: row.maxspeed
			}
		}));

		const geojson = {
			type: 'FeatureCollection',
			features: features
		};

		return geojson;
	} catch (error) {
		console.error('Erreur lors de la requête PostgreSQL:', error);
		throw new Error('Erreur lors de la récupération des routes');
	}
}
