import { SourceType } from "@/lib/constants";
import { config } from "@/lib/config";
import { DiscoverySource } from "@/lib/types";

export const redditAdapter: DiscoverySource = {
  name: "Reddit (optional)",
  type: SourceType.reddit,
  isEnabled: () => config.enableReddit && Boolean(config.redditClientId && config.redditClientSecret),
  discover: async () => []
};
