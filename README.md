# Carte des routes d'île-de-france 

Ce projet utilise [Svelte](https://svelte.dev/) pour le frontend et une base de données PostgreSQL avec pgAdmin pour la gestion des données. Nous utilisons `osm2pgsql` pour importer des fichiers OpenStreetMap dans PostgreSQL.

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (Version 20+ recommandée)
- [Docker](https://www.docker.com/)
- [osm2pgsql](https://osm2pgsql.org/)

## Cloner le projet

Clonez le projet depuis le dépôt Git :

```bash
git clone https://github.com/Ahmed-Mouzoune/leakmited.git
cd leakmited
```

## Configuration du fichier .env
Le projet Svelte utilise un fichier d'environnement pour configurer certaines variables. Copiez le fichier .env.example en .env.

```bash
cp .env.example .env
```

## Lancement de la base de données

Une fois que vous avez cloné le projet démarrez la base de données PostgreSQL avec :

```bash
docker-compose up -d
```

## Alimenter la base de données avec les données OpenStreetMap d'île-de-france
Télécharger le fichier ile-de-france.osm.pbf => [lien](https://download.geofabrik.de/europe/france/ile-de-france-latest.osm.pbf)

Placer le fichier télécharger dans le dossier osm2pgsql du projet "leakmited/osm2pgsql".

Utiliser osm2pgsql pour alimenter la base de données avec le fichier .osm.pbf :

```bash
osm2pgsql.exe -c -d osm_database -U postgres -H localhost -P 54326 -W -S .\osm2pgsql\default.style .\osm2pgsql\ile-de-france-latest.osm.pbf 

```

## Lancement de svelte

Une fois que vous avez cloné le projet et installé les dépendances avec `npm install` (ou `pnpm install` ou `yarn`), démarrez l'application :

```bash
npm run dev
```