# Scoring

Formulas are implemented in `lib/scoring/formulas.ts`.
- Popularity: stars + references + source/domain spread + author spread + recency bonus.
- Trend: velocity over 24h/7d/30d weighted toward recency.
- Confidence: corroboration + metadata completeness.

Scores are persisted to Tool and snapshot into ScoreHistory.
