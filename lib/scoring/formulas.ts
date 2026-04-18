import { Tool } from "@prisma/client";

/**
 * Transparent deterministic scoring formula for MVP.
 */
export function computeScores(tool: Tool, metrics: { recent24h: number; recent7d: number; recent30d: number; distinctAuthors: number; }) {
  const starsWeight = Math.log10(tool.githubStars + 1) * 20;
  const referencesWeight = Math.log10(tool.sourceReferenceCount + 1) * 15;
  const domainWeight = Math.min(tool.distinctSourceCount * 3, 20);
  const authorWeight = Math.min(metrics.distinctAuthors * 1.5, 10);
  const recencyWeight = metrics.recent7d > 0 ? 10 : metrics.recent30d > 0 ? 5 : 0;
  const popularity = Math.min(100, starsWeight + referencesWeight + domainWeight + authorWeight + recencyWeight);

  const trend = Math.min(100,
    metrics.recent24h * 15 +
    metrics.recent7d * 4 +
    metrics.recent30d * 1.2 +
    Math.min(Math.log10(tool.githubStars + 1) * 5, 15)
  );

  const confidence = Math.min(100,
    (tool.githubUrl ? 25 : 0) +
    (tool.websiteUrl ? 20 : 0) +
    Math.min(tool.sourceReferenceCount * 5, 25) +
    (tool.shortDescription ? 10 : 0) +
    (tool.status === "needs_review" ? -15 : 10)
  );

  return { popularity, trend, confidence };
}
