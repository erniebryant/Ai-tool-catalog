import { SourceTypeValue } from "@/lib/constants";

export interface DiscoveredReference {
  sourceType: SourceTypeValue;
  sourceName: string;
  sourceAccount?: string;
  sourceDomain?: string;
  sourceUrl: string;
  rawTitle?: string;
  rawText?: string;
  normalizedToolName?: string;
  extractedUrls?: string[];
  publishedAt?: Date;
  engagement?: Record<string, number>;
  confidenceScore?: number;
  rawPayload?: unknown;
}

export interface DiscoverySource {
  name: string;
  type: SourceTypeValue;
  isEnabled: () => boolean;
  discover: () => Promise<DiscoveredReference[]>;
}
