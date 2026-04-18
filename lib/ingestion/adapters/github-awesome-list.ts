import { SourceType } from "@/lib/constants";
import { DiscoveredReference, DiscoverySource } from "@/lib/types";

const awesomeLists = [
  "https://raw.githubusercontent.com/e2b-dev/awesome-ai-agents/main/README.md",
  "https://raw.githubusercontent.com/mahseema/awesome-ai-tools/main/README.md"
];

export const githubAwesomeListAdapter: DiscoverySource = {
  name: "GitHub Awesome Lists",
  type: SourceType.github_awesome_list,
  isEnabled: () => true,
  discover: async () => {
    const refs: DiscoveredReference[] = [];
    const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    for (const listUrl of awesomeLists) {
      try {
        const res = await fetch(listUrl);
        if (!res.ok) continue;
        const md = await res.text();
        for (const m of md.matchAll(mdLinkRegex)) {
        refs.push({
          sourceType: SourceType.github_awesome_list,
          sourceName: "Awesome List",
          sourceDomain: "github.com",
          sourceUrl: m[2],
          rawTitle: m[1],
          normalizedToolName: m[1],
          rawText: `Discovered from ${listUrl}`,
          confidenceScore: 0.55,
          rawPayload: { listUrl, label: m[1], url: m[2] }
        });
        }
      } catch {
        continue;
      }
    }
    return refs.slice(0, 200);
  }
};
