export const SourceType = {
  github_search: "github_search",
  github_awesome_list: "github_awesome_list",
  rss_webpage: "rss_webpage",
  hacker_news: "hacker_news",
  reddit: "reddit",
  x_twitter: "x_twitter",
  manual: "manual"
} as const;

export type SourceTypeValue = (typeof SourceType)[keyof typeof SourceType];
