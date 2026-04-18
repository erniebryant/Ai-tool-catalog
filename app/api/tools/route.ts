import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 25);
  const q = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "trend";

  const tools = await prisma.tool.findMany({
    where: { name: { contains: q } },
    orderBy: sort === "stars" ? { githubStars: "desc" } : sort === "popularity" ? { popularityScore: "desc" } : { trendScore: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize
  });

  return NextResponse.json(tools);
}
