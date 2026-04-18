import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function ToolsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const q = params.q ?? "";
  const category = params.category;
  const sort = params.sort ?? "trend";

  const tools = await prisma.tool.findMany({
    where: {
      name: { contains: q },
      ...(category ? { categories: { some: { category: { slug: category } } } } : {})
    },
    orderBy: sort === "stars" ? { githubStars: "desc" } : sort === "popularity" ? { popularityScore: "desc" } : { trendScore: "desc" },
    include: { categories: { include: { category: true } }, tags: { include: { tag: true } } },
    take: 100
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tool Directory</h1>
      <form className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search tools..." className="rounded border px-3 py-2" />
        <select name="sort" defaultValue={sort} className="rounded border px-3 py-2">
          <option value="trend">Trending</option>
          <option value="popularity">Popularity</option>
          <option value="stars">GitHub Stars</option>
        </select>
        <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">Apply</button>
      </form>
      <div className="grid gap-3">
        {tools.map((t) => (
          <article key={t.id} className="rounded border bg-white p-4">
            <Link href={`/tools/${t.slug}`} className="text-lg font-semibold">{t.name}</Link>
            <p className="text-sm text-slate-600">{t.shortDescription}</p>
            <p className="text-xs">Stars: {t.githubStars} · Trend: {t.trendScore.toFixed(1)} · Popularity: {t.popularityScore.toFixed(1)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
