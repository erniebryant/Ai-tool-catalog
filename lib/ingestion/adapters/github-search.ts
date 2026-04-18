import { SourceType } from "@/lib/constants";
import { config } from "@/lib/config";
import { DiscoveredReference, DiscoverySource } from "@/lib/types";

const queries = ["AI agent", "LLM tool", "RAG", "autonomous coding", "MCP", "agent framework", "AI workflow"];

export const githubSearchAdapter: DiscoverySource = {
  name: "GitHub Search",
  type: SourceType.github_search,
  isEnabled: () => config.enableGithub,
  discover: async () => {
    const refs: DiscoveredReference[] = [];
    for (const q of queries.slice(0, 3)) {
      try {
        const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&per_page=${config.ingestMaxResults}`, {
          headers: {
            Accept: "application/vnd.github+json",
            ...(config.githubToken ? { Authorization: `Bearer ${config.githubToken}` } : {})
          }
        });
        if (!res.ok) continue;
        const json = await res.json() as { items?: Array<Record<string, unknown>> };
        for (const item of json.items ?? []) {
          const fullName = String(item.full_name ?? "");
          const htmlUrl = String(item.html_url ?? "");
          refs.push({
            sourceType: SourceType.github_search,
            sourceName: "GitHub",
            sourceDomain: "github.com",
            sourceUrl: htmlUrl,
            rawTitle: String(item.name ?? fullName),
            rawText: String(item.description ?? ""),
            normalizedToolName: String(item.name ?? ""),
            extractedUrls: [htmlUrl, String(item.homepage ?? "")].filter(Boolean),
            publishedAt: item.updated_at ? new Date(String(item.updated_at)) : undefined,
            engagement: { stars: Number(item.stargazers_count ?? 0), forks: Number(item.forks_count ?? 0) },
            confidenceScore: 0.85,
            rawPayload: item
          });
        }
      } catch {
        continue;
      }
    }
    return refs;
  }
};
