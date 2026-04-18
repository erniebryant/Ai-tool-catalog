import { prisma } from "@/lib/db";

export default async function SourcesPage() {
  const refs = await prisma.sourceReference.findMany({ orderBy: { discoveredAt: "desc" }, take: 100, include: { tool: true } });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Sources / References</h1>
      <div className="space-y-2">
        {refs.map((r) => (
          <div key={r.id} className="rounded border bg-white p-3 text-sm">
            <a href={r.sourceUrl} className="font-medium">{r.rawTitle ?? r.sourceUrl}</a>
            <p>{r.sourceName} · {r.sourceType} · confidence {r.confidenceScore}</p>
            <p>tool: {r.tool?.name ?? "unresolved"} · status: {r.processedStatus}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
