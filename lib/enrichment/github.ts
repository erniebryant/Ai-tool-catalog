import { prisma } from "@/lib/db";
import { config } from "@/lib/config";

export async function enrichFromGitHub() {
  const tools = await prisma.tool.findMany({ where: { githubUrl: { not: null } }, take: 100 });
  for (const tool of tools) {
    if (!tool.githubOwner || !tool.githubRepoName) continue;
    try {
      const res = await fetch(`https://api.github.com/repos/${tool.githubOwner}/${tool.githubRepoName}`, {
        headers: {
          Accept: "application/vnd.github+json",
          ...(config.githubToken ? { Authorization: `Bearer ${config.githubToken}` } : {})
        }
      });
      if (!res.ok) continue;
      const repo = await res.json() as Record<string, unknown>;
      await prisma.tool.update({
        where: { id: tool.id },
        data: {
          githubStars: Number(repo.stargazers_count ?? 0),
          githubForks: Number(repo.forks_count ?? 0),
          githubOpenIssues: Number(repo.open_issues_count ?? 0),
          githubLicense: String((repo.license as { spdx_id?: string } | null)?.spdx_id ?? ""),
          githubLanguage: String(repo.language ?? ""),
          shortDescription: tool.shortDescription ?? String(repo.description ?? ""),
          githubLastPushedAt: repo.pushed_at ? new Date(String(repo.pushed_at)) : null,
          lastEnrichedAt: new Date()
        }
      });
    } catch {
      continue;
    }
  }
}
