import { DiscoverySource } from "@/lib/types";
import { githubSearchAdapter } from "./github-search";
import { githubAwesomeListAdapter } from "./github-awesome-list";
import { hackerNewsAdapter } from "./hacker-news";
import { redditAdapter } from "./reddit";
import { rssWebpageAdapter } from "./rss-webpage";
import { xTwitterAdapter } from "./x-twitter";

export const sources: DiscoverySource[] = [
  githubSearchAdapter,
  githubAwesomeListAdapter,
  rssWebpageAdapter,
  hackerNewsAdapter,
  redditAdapter,
  xTwitterAdapter
];
