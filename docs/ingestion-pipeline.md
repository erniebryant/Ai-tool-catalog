# Ingestion pipeline

Stages:
1. Discover references from enabled adapters.
2. Normalize candidate URLs/tool names.
3. Resolve canonical identity and dedupe by GitHub URL, website URL, slug.
4. Persist SourceReference raw payload.
5. Upsert tool, category, tags.
6. Mark low-confidence tools as `needs_review`.
