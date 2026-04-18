import { SourceType } from "@/lib/constants";
import { config } from "@/lib/config";
import { DiscoverySource } from "@/lib/types";

export const xTwitterAdapter: DiscoverySource = {
  name: "X/Twitter (optional)",
  type: SourceType.x_twitter,
  isEnabled: () => config.enableX && Boolean(config.xBearerToken),
  discover: async () => []
};
