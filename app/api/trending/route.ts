import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  return NextResponse.json(await prisma.tool.findMany({ orderBy: { trendScore: "desc" }, take: 20 }));
}
