import { SourceType } from "@/lib/constants";
import { config } from "@/lib/config";
import { DiscoveredReference, DiscoverySource } from "@/lib/types";

export const hackerNewsAdapter: DiscoverySource = {
  name: "Hacker News",
  type: SourceType.hacker_news,
  isEnabled: () => config.enableHn,
  discover: async () => {
    const terms = ["AI tool", "LLM", "RAG", "agent"]; 
    const refs: DiscoveredReference[] = [];
    for (const term of terms) {
      try {
        const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(term)}&tags=story&hitsPerPage=${config.ingestMaxResults}`;
        const res = await fetch(url);
        if (!res.ok) continue;
        const json = await res.json() as { hits?: Array<Record<string, unknown>> };
        for (const hit of json.hits ?? []) {
          refs.push({
            sourceType: SourceType.hacker_news,
            sourceName: "Hacker News",
            sourceDomain: "news.ycombinator.com",
            sourceUrl: String(hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`),
            rawTitle: String(hit.title ?? ""),
            rawText: String(hit.story_text ?? ""),
            normalizedToolName: String(hit.title ?? ""),
            sourceAccount: String(hit.author ?? ""),
            publishedAt: hit.created_at ? new Date(String(hit.created_at)) : undefined,
            engagement: { points: Number(hit.points ?? 0), comments: Number(hit.num_comments ?? 0) },
            confidenceScore: 0.5,
            rawPayload: hit
          });
        }
      } catch {
        continue;
      }
    }
    return refs;
  }
};
