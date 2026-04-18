import { prisma } from "@/lib/db";

export default async function ReviewPage() {
  const tools = await prisma.tool.findMany({ where: { OR: [{ status: "needs_review" }, { status: "duplicate" }] }, take: 100, orderBy: { updatedAt: "desc" } });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Admin Review</h1>
      <p className="mb-3 text-sm">Use API or Prisma Studio to mark statuses: active, duplicate, archived, needs_review.</p>
      <ul className="space-y-2">
        {tools.map((t) => <li key={t.id} className="rounded border bg-white p-3">{t.name} · {t.status}</li>)}
      </ul>
    </div>
  );
}
