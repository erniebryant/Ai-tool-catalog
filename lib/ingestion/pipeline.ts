
import { prisma } from "@/lib/db";
import { toSlug } from "@/lib/utils/slug";
import { sources } from "@/lib/ingestion/adapters";
import { extractKeywords, inferCategory } from "@/lib/ingestion/categorization";
import { DiscoveredReference } from "@/lib/types";

function normalizeGithub(url?: string) {
  if (!url?.includes("github.com")) return null;
  const match = url.match(/github\.com\/(.+?)\/(.+?)(?:\/|$)/i);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, ""), repoUrl: `https://github.com/${match[1]}/${match[2].replace(/\.git$/, "")}` };
}

async function ensureCategory(name: string) {
  const slug = toSlug(name);
  return prisma.category.upsert({ where: { slug }, create: { name, slug }, update: {} });
}

async function ensureTag(name: string) {
  const slug = toSlug(name);
  return prisma.tag.upsert({ where: { slug }, create: { name, slug }, update: {} });
}

async function resolveAndUpsertTool(ref: DiscoveredReference) {
  const candidateUrl = ref.extractedUrls?.find((u) => u.startsWith("https://")) ?? ref.sourceUrl;
  const gh = normalizeGithub(candidateUrl) ?? normalizeGithub(ref.sourceUrl);
  const website = gh ? ref.extractedUrls?.find((u) => !u.includes("github.com")) : candidateUrl;
  const canonicalName = (ref.normalizedToolName || ref.rawTitle || "Unknown Tool").trim().slice(0, 120);
  const slug = toSlug(canonicalName) || `tool-${Date.now()}`;

  const existing = await prisma.tool.findFirst({
    where: {
      OR: [
        gh ? { githubUrl: gh.repoUrl } : undefined,
        website ? { websiteUrl: website } : undefined,
        { slug }
      ].filter(Boolean) as never
    }
  });

  const categoryName = inferCategory(`${ref.rawTitle ?? ""} ${ref.rawText ?? ""}`);
  const category = await ensureCategory(categoryName);
  const keywords = extractKeywords(`${ref.rawTitle ?? ""} ${ref.rawText ?? ""}`);

  const tool = existing
    ? await prisma.tool.update({
        where: { id: existing.id },
        data: {
          lastSeenAt: new Date(),
          sourceReferenceCount: { increment: 1 },
          distinctSourceCount: existing.distinctSourceCount + (ref.sourceDomain ? 1 : 0)
        }
      })
    : await prisma.tool.create({
        data: {
          name: canonicalName,
          slug,
          shortDescription: ref.rawText?.slice(0, 280),
          websiteUrl: website,
          githubUrl: gh?.repoUrl,
          githubOwner: gh?.owner,
          githubRepoName: gh?.repo,
          status: ref.confidenceScore && ref.confidenceScore > 0.6 ? "active" : "needs_review",
          businessModel: gh ? "open_source" : "unknown",
          sourceReferenceCount: 1,
          distinctSourceCount: ref.sourceDomain ? 1 : 0,
          confidenceScore: (ref.confidenceScore ?? 0.4) * 100,
          extractionNotes: "deterministic-ingestion"
        }
      });

  await prisma.toolCategory.upsert({ where: { toolId_categoryId: { toolId: tool.id, categoryId: category.id } }, create: { toolId: tool.id, categoryId: category.id, isPrimary: true }, update: {} });

  for (const kw of keywords) {
    const tag = await ensureTag(kw);
    await prisma.toolTag.upsert({ where: { toolId_tagId: { toolId: tool.id, tagId: tag.id } }, create: { toolId: tool.id, tagId: tag.id }, update: {} });
  }

  await prisma.sourceReference.create({
    data: {
      toolId: tool.id,
      sourceType: ref.sourceType,
      sourceName: ref.sourceName,
      sourceAccount: ref.sourceAccount,
      sourceDomain: ref.sourceDomain,
      sourceUrl: ref.sourceUrl,
      rawTitle: ref.rawTitle,
      rawText: ref.rawText,
      normalizedToolName: ref.normalizedToolName,
      extractedUrls: JSON.stringify(ref.extractedUrls ?? []),
      publishedAt: ref.publishedAt,
      engagement: JSON.stringify(ref.engagement ?? {}),
      confidenceScore: ref.confidenceScore ?? 0.4,
      rawPayload: JSON.stringify(ref.rawPayload ?? {})
    }
  });
}

export async function runIngestion() {
  const enabled = sources.filter((s) => s.isEnabled());
  for (const src of enabled) {
    try {
      const refs = await src.discover();
      for (const ref of refs) {
        await resolveAndUpsertTool(ref);
      }
    } catch {
      continue;
    }
  }
}
