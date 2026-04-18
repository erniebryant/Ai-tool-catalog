import Parser from "rss-parser";
import { SourceType } from "@/lib/constants";
import { config } from "@/lib/config";
import { DiscoveredReference, DiscoverySource } from "@/lib/types";

const parser = new Parser();

export const rssWebpageAdapter: DiscoverySource = {
  name: "RSS/Web Feeds",
  type: SourceType.rss_webpage,
  isEnabled: () => config.sourceFeeds.length > 0,
  discover: async () => {
    const refs: DiscoveredReference[] = [];
    for (const feed of config.sourceFeeds) {
      try {
        const parsed = await parser.parseURL(feed);
        for (const item of parsed.items.slice(0, config.ingestMaxResults)) {
          refs.push({
            sourceType: SourceType.rss_webpage,
            sourceName: parsed.title ?? "RSS",
            sourceDomain: new URL(feed).hostname,
            sourceUrl: item.link ?? feed,
            rawTitle: item.title,
            rawText: item.contentSnippet,
            normalizedToolName: item.title,
            publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
            confidenceScore: 0.45,
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
