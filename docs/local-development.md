# Local development

1. Install deps: `npm install`
2. Configure env: `cp .env.example .env`
3. Run migrations: `npx prisma migrate dev --name init`
4. Seed: `npm run seed`
5. Start app: `npm run dev`
6. Run jobs: `npm run ingest && npm run enrich && npm run score`
