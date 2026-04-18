# Contributing

Thanks for contributing.

## Development flow
1. Open an issue describing data source or schema changes.
2. Add/adjust Prisma models and migrations.
3. Add or update adapters under `lib/ingestion/adapters`.
4. Add docs for behavior changes.
5. Run `npm run lint` and `npm run build` before PR.

## Adapter guidelines
- Implement `DiscoverySource`.
- Keep adapters idempotent and bounded.
- Preserve raw payload data for traceability.
- Fail gracefully when credentials are missing.
