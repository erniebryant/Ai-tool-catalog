import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const page = Number(new URL(req.url).searchParams.get("page") ?? 1);
  const pageSize = Number(new URL(req.url).searchParams.get("pageSize") ?? 25);
  const refs = await prisma.sourceReference.findMany({ skip: (page - 1) * pageSize, take: pageSize, orderBy: { discoveredAt: "desc" } });
  return NextResponse.json(refs);
}
