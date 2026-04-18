import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await prisma.tool.findUnique({
    where: { slug },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      references: { orderBy: { discoveredAt: "desc" }, take: 20 }
    }
  });
  if (!tool) return notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{tool.name}</h1>
      <p>{tool.longDescription ?? tool.shortDescription}</p>
      <p>Website: {tool.websiteUrl ? <a href={tool.websiteUrl}>{tool.websiteUrl}</a> : "N/A"}</p>
      <p>GitHub: {tool.githubUrl ? <a href={tool.githubUrl}>{tool.githubUrl}</a> : "N/A"}</p>
      <p>Scores · Popularity {tool.popularityScore.toFixed(1)} · Trend {tool.trendScore.toFixed(1)} · Confidence {tool.confidenceScore.toFixed(1)}</p>
      <p>GitHub metadata · ⭐ {tool.githubStars} · Forks {tool.githubForks} · License {tool.githubLicense || "unknown"}</p>
      <div>Categories: {tool.categories.map((c) => c.category.name).join(", ")}</div>
      <div>Tags: {tool.tags.map((t) => t.tag.name).join(", ")}</div>
      <h2 className="text-xl font-semibold">Source references</h2>
      <ul className="list-disc pl-5">
        {tool.references.map((r) => (
          <li key={r.id}><a href={r.sourceUrl}>{r.rawTitle ?? r.sourceUrl}</a> ({r.sourceType})</li>
        ))}
      </ul>
    </div>
  );
}
