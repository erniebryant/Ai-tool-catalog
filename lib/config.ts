export const config = {
  adminToken: process.env.ADMIN_INGEST_TOKEN ?? "changeme",
  ingestMaxResults: Number(process.env.INGEST_MAX_RESULTS_PER_SOURCE ?? 25),
  enableGithub: process.env.ENABLE_GITHUB_SOURCE !== "false",
  enableHn: process.env.ENABLE_HN_SOURCE !== "false",
  enableReddit: process.env.ENABLE_REDDIT_SOURCE === "true",
  enableX: process.env.ENABLE_X_SOURCE === "true",
  githubToken: process.env.GITHUB_TOKEN,
  xBearerToken: process.env.X_BEARER_TOKEN,
  redditClientId: process.env.REDDIT_CLIENT_ID,
  redditClientSecret: process.env.REDDIT_CLIENT_SECRET,
  sourceFeeds: (process.env.SOURCE_FEEDS ?? "").split(",").map((s) => s.trim()).filter(Boolean)
};
