# Architecture

The system has three layers:
1. Discovery adapters (`lib/ingestion/adapters`) to fetch references.
2. Ingestion pipeline (`lib/ingestion/pipeline.ts`) to normalize, dedupe, classify, persist.
3. Serving/UI layer (Next.js pages + API routes).

Background jobs run via script entrypoints in `scripts/` and can be scheduled externally.
