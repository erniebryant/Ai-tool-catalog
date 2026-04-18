# AI Tool Catalog

Open-source discovery and intelligence layer for AI-powered tools. It continuously ingests references from public sources, normalizes tools into a canonical schema, enriches metadata, computes trend/popularity/confidence scores, and exposes data via UI and API.

## Stack
- Next.js App Router + TypeScript
- Prisma ORM
- SQLite for local dev (swap to PostgreSQL in production)
- Tailwind CSS
- Cron-friendly Node scripts for ingestion/enrichment/scoring

## Quick start
1. `cp .env.example .env`
2. `npm install`
3. `npx prisma migrate dev --name init`
4. `npm run seed`
5. `npm run dev`

## Scripts
- `npm run ingest` discover + normalize + persist source references/tools
- `npm run enrich` enrich from GitHub + websites
- `npm run score` compute popularity/trend/confidence
- `npm run sync:github` refresh GitHub metadata only
- `npm run build`, `npm run lint`

## API
- `GET /api/tools`
- `GET /api/tools/[slug]`
- `GET /api/categories`
- `GET /api/tags`
- `GET /api/trending`
- `GET /api/sources`
- `POST /api/ingest/run` with `x-admin-token`
- `POST /api/enrich/run` with `x-admin-token`

## Sources
Built-in source adapters: GitHub search, GitHub awesome lists, RSS/web feeds, Hacker News; Reddit and X adapters are scaffolded and gracefully disabled by default unless credentials are present.

## Add a source adapter
1. Add new adapter in `lib/ingestion/adapters/` implementing `DiscoverySource`.
2. Register in `lib/ingestion/adapters/index.ts`.
3. Return `DiscoveredReference[]` with raw payload and confidence score.
4. Keep extraction deterministic and bounded.

## Ethical ingestion
Use official APIs where possible, honor source terms, avoid scraping private/protected content, and keep crawling bounded.

## Deployment
Use managed PostgreSQL in production. Update `prisma/schema.prisma` datasource provider to `postgresql`, run migrations, and schedule ingestion scripts via GitHub Actions or platform cron jobs.
