import { prisma } from "@/lib/db";
import { computeScores } from "@/lib/scoring/formulas";

(async () => {
  const tools = await prisma.tool.findMany({ include: { references: true } });
  const now = Date.now();
  for (const tool of tools) {
    const refs = tool.references;
    const metrics = {
      recent24h: refs.filter((r) => now - new Date(r.discoveredAt).getTime() < 24 * 3600 * 1000).length,
      recent7d: refs.filter((r) => now - new Date(r.discoveredAt).getTime() < 7 * 24 * 3600 * 1000).length,
      recent30d: refs.filter((r) => now - new Date(r.discoveredAt).getTime() < 30 * 24 * 3600 * 1000).length,
      distinctAuthors: new Set(refs.map((r) => r.sourceAccount).filter(Boolean)).size
    };
    const scores = computeScores(tool, metrics);
    await prisma.tool.update({ where: { id: tool.id }, data: {
      popularityScore: scores.popularity,
      trendScore: scores.trend,
      confidenceScore: scores.confidence
    }});
    await prisma.scoreHistory.create({ data: {
      toolId: tool.id,
      popularityScore: scores.popularity,
      trendScore: scores.trend,
      confidenceScore: scores.confidence
    }});
  }
  console.log("Scoring complete");
})();
