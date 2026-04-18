import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const [total, recent, trending, categories] = await Promise.all([
    prisma.tool.count(),
    prisma.tool.count({ where: { firstDiscoveredAt: { gte: new Date(Date.now() - 7 * 24 * 3600 * 1000) } } }),
    prisma.tool.findMany({ orderBy: { trendScore: "desc" }, take: 8 }),
    prisma.category.findMany({ include: { tools: true }, take: 10 })
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Tool Catalog</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded border bg-white p-4">Total indexed tools: <b>{total}</b></div>
        <div className="rounded border bg-white p-4">Discovered in last 7 days: <b>{recent}</b></div>
        <div className="rounded border bg-white p-4">Top categories: <b>{categories.length}</b></div>
      </div>
      <section>
        <h2 className="mb-2 text-xl font-semibold">Trending tools</h2>
        <ul className="space-y-2">
          {trending.map((t) => (
            <li key={t.id} className="rounded border bg-white p-3">
              <Link href={`/tools/${t.slug}`} className="font-medium">{t.name}</Link>
              <p className="text-sm text-slate-600">Trend {t.trendScore.toFixed(1)} · Stars {t.githubStars}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
